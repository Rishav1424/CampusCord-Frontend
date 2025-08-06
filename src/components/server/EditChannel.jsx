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
import { editChannel } from "@/store/serverSlice";
import { useParams } from "react-router-dom";

const EditChannel = ({ channels, channel }) => {
  const [name, setName] = useState(channel.name);
  const [topic, setTopic] = useState(channel.topic);
  const [restricted, setRestricted] = useState(channel.restricted);
  const dispatch = useDispatch();
  const serverId = useParams().serverId;

  const submit = async () => {
    if (channel.name != name && channels.some((c) => c.name == name)) {
      toast.error("Channel name alreay exist");
      return;
    }
    const response = await api.patch(
      `server/${serverId}/channel/${channel.name}`,
      {
        name,
        topic,
        restricted,
      }
    );
    if (response.status == 200) {
      toast.success("Channel updated successfully");
      dispatch(editChannel({ id: channel.name, name, topic, restricted }));
    }
  };
  return (
    <>
    <DialogDescription>Edit Channel</DialogDescription>
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
          <Label>Channel is room</Label>
          <Switch disabled checked={channel.call} />
        </div>
      </div>
      <Separator />
      <DialogFooter className="flex-row justify-end">
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={submit}>Create Channel</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default EditChannel;
