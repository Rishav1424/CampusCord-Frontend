import React from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { DialogFooter } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { removeChannel } from "@/store/serverSlice";
import { useParams } from "react-router-dom";

const DeleteChannel = ({ channel }) => {
  const dispatch = useDispatch();
  const serverId = useParams().serverId;

  const submit = async () => {
    const response = await api.delete(
      `server/${serverId}/channel/${channel.name}`
    );
    if (response.status == 200) {
      toast.success("Channel deleted successfully");
      dispatch(removeChannel({ id: channel.name }));
    }
  };
  return (
    <>
      <p>
        Are you sure? <br /> You want to delete channel {channel.name}
      </p>
      <Separator />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" onClick={submit}>
            Delete Channel
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default DeleteChannel;
