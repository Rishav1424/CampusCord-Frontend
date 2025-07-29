import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowBigUpDash, File } from "lucide-react";
import { Badge } from "../ui/badge";
import api from "@/lib/api";
import { useParams } from "react-router-dom";
import { emitSocketEvent } from "@/lib/socket";

const Message = ({ message }) => {
  const serverId = useParams().serverId;
  const channelName = useParams().channelName;

  const like = async () => {
    console.log("clicked");
    const res = await api.post(
      `server/${serverId}/channel/${channelName}/message/${message.id}/like`
    );
    if (res.status == 200) {
      emitSocketEvent("like", channelName, message.id);
    }
  };

  const disLike = async () => {
    const res = await api.delete(
      `server/${serverId}/channel/${channelName}/message/${message.id}/dislike`
    );
    if (res.status == 200) {
      emitSocketEvent("dislike", channelName, message.id);
    }
  };

  return (
    <div
      className={"w-full flex flex-col p-4" + (message.self && " items-end")}
    >
      <div className="flex gap-2 items-center">
        {message.self || (
          <Avatar className="size-10">
            <AvatarImage src={message.createdBy.avatar} />
            <AvatarFallback>{message.createdBy.username[0]}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <div
            className={
              "text-primary font-semibold text-sm underline" +
              (message.self && " text-right")
            }
          >
            {message.self ? "you" : message.createdBy.username}
          </div>
          <div className="text-muted text-xs">
            {Date(message.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>
      <Card className="py-2 px-4 ml-10 mt-2 w-fit max-w-4/5 lg:max-w-2xl gap-2 bg-card/50 relative group">
        <p className=" leading-5 text-sm text-card-foreground/50">
          {message.content}
        </p>
        {message.media.filter((m) => m.type != "FILE").length > 0 && (
          <ScrollArea className="p-1 rounded bg-card border">
            <div className="flex gap-2">
              {message.media
                .filter((m) => m.type !== "FILE")
                .map((media) =>
                  media.type == "IMAGE" ? (
                    <img
                      className="w-auto h-48"
                      src={media.path}
                      key={media.name}
                    />
                  ) : (
                    <video
                      controls
                      className="w-auto h-48"
                      src={media.path}
                      key={media.name}
                    />
                  )
                )}
              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        )}
        {message.media
          .filter((m) => m.type == "FILE")
          .map((f) => (
            <Button variant="outline" asChild key={f.name}>
              <a
                href={f.path}
                className="flex justify-start overflow-clip px-0! py-0! max-w-54 h-auto"
              >
                <div className="bg-primary px-3 py-2">
                  <File className="bg-primary size-6" />
                </div>
                <div className="truncate p-2 text-sm">{f.name}</div>
              </a>
            </Button>
          ))}
      {message.liked ? (
        <Badge className="-translate-y-1/2 cursor-pointer absolute -bottom-7 right-2" onClick={disLike}>
          <ArrowBigUpDash className="size-4" fill="currentColor"/>
          {message.likes}
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className={"-translate-y-1/2 bg-background/75 hover:bg-accent cursor-pointer group-hover:opacity-100 transition absolute -bottom-7 right-2" + (message.likes == 0 && " opacity-0")}
          onClick={like}
        >
          <ArrowBigUpDash/>
          {message.likes}
        </Badge>
      )}
      </Card>
    </div>
  );
};

export default Message;
