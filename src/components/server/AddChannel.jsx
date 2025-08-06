import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { DialogDescription, DialogFooter } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addChannel } from "@/store/serverSlice";
import { useParams } from "react-router-dom";

const AddChannel = ({ channels }) => {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [call, setCall] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const dispatch = useDispatch();
  const serverId = useParams().serverId;

  const submit = async () => {
    if (channels.some((c) => c.name == name)) {
      toast.error("Channel name alreay exist");
      return;
    }
    const response = await api.post(`server/${serverId}/channel`, {
      name,
      topic,
      call,
      restricted,
    });
    if (response.status == 201) {
      toast.success("Channel added successfully");
      dispatch(addChannel({ name, topic, call, restricted }));
    }
  };
  return (
    <>
      <DialogDescription>Ctreate new Channel</DialogDescription>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name"> Name of Channel</Label>
        <Input
          id="name"
          placeholder="Give your channel a unique name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Label htmlFor="topic"> What is this channel about</Label>
        <Textarea
          id="topic"
          placeholder="Tell something about this channell"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className="flex gap-4">
          <Label>Make this channel restricted</Label>
          <Switch checked={restricted} onCheckedChange={setRestricted} />
        </div>
        <div className="flex gap-4">
          <Label>Make this channel as room</Label>
          <Switch checked={call} onCheckedChange={setCall} />
        </div>
        <Separator />
      </div>
      <DialogFooter className="flex-row justify-end">
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" onClick={submit}>
            Create Channel
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default AddChannel;
