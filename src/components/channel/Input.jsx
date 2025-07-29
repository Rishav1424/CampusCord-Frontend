import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  File,
  Loader2,
  Paperclip,
  PlusCircle,
  SendHorizonal,
  X,
} from "lucide-react";
import { Label } from "../ui/label";
import { emitSocketEvent } from "@/lib/socket";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";

const Inputbox = () => {
  const serverId = useParams().serverId;
  const channelName = useParams().channelName;
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleFileInput = (e) => {
    setMedia((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post(
        `server/${serverId}/channel/${channelName}/message`,
        {
          content,
          media: media.map((m) => ({ type: getType(m.type), name: m.name })),
        }
      );

      try {
        await Promise.all(
          res?.data?.uploadUrls?.map((url, i) =>
            fetch(url, {
              method: "PUT",
              body: media[i],
            })
          )
        );
        emitSocketEvent("sendMessage", channelName, res.data.message, () => {
          toast.success("message sent");
          setContent("");
          setMedia([]);
          setLoading(false);
        });
      } catch (error) {
        throw new Error(error);
      }
    } catch (error) {
      toast.error(error.message);
      setContent("");
      setMedia([]);
      setLoading(false);
    }
  };

  const getType = (type) => {
    if (type.startsWith("image")) return "IMAGE";
    if (type.startsWith("video")) return "VIDEO";
    return "FILE";
  };

  return (
    <form
      className={
        "rounded-lg bg-accent/20 border hover:bg-accent/30 transition focus-within:bg-accent/30 p-4 m-2 " +
        (loading && "opacity-50 pointer-events-none")
      }
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        className="w-full resize-none overflow-hidden text-sm focus:outline-none max-h-40"
        rows={1}
      />
      <div className="flex gap-2 mt-2 max-h-24 items-end">
        <Button variant="outline" asChild>
          <Label>
            <Input hidden multiple type="file" onChange={handleFileInput} />
            <Paperclip />
            Add Attatchment
          </Label>
        </Button>
        <div className="flex-1 flex gap-2 items-end">
          {media.map((mm, index) =>
            getType(mm.type) == "FILE" ? (
              <Button
                type="button"
                key={index}
                variant="secondary"
                className="max-w-16 truncate"
                onClick={() => {
                  setMedia((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                <File size="20" />
                {mm.name}
                <X />
              </Button>
            ) : (
              <Button
                type="button"
                key={index}
                variant="secondary"
                className="group transition p-0! size-16 relative overflow-clip"
                onClick={() => {
                  setMedia((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                {getType(mm.type) == "IMAGE" ? (
                  <img
                    src={URL.createObjectURL(mm)}
                    className="size-full object-cover group-hover:opacity-50"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(mm)}
                    autoPlay
                    muted
                    className="size-full group-hover:opacity-50"
                  />
                )}
                <X className="absolute size-8 transition opacity-0 group-hover:opacity-100" />
              </Button>
            )
          )}
        </div>
        <Button type="submit" onClick={handleSubmit}>
          Send
          {loading ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
        </Button>
      </div>
    </form>
  );
};

export default Inputbox;
