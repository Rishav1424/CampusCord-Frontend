import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { PenBox } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { updateServer } from "@/store/serverSlice";
import { DialogDescription } from "@radix-ui/react-dialog";

const ModifyServer = () => {
  const server = useSelector((state) => state.server);
  const [name, setName] = useState(server.name);
  const [description, setDescription] = useState(server.description || "");
  const [icon, setIcon] = useState();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const response = await api.patch(`server/${server.id}`, {
      name,
      description,
    });
    if (response.status == 200) {
      console.log(icon?.type);
      if (icon) {
        try {
          await fetch(response.data.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "image/*",
            },
            body: icon,
          });
          toast.success("Server details updated successfully");
          dispatch(updateServer(response.data.server));
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  };
  return (
    <>
      <DialogDescription>Edit Server Details</DialogDescription>
      <div className="flex flex-col justify-start gap-4 h-full">
        <div className="flex gap-8 items-end">
          <div>
            <Label className="group relative">
              <Input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setIcon(e.target.files[0])}
              />
              <Avatar className="size-20 group-hover:opacity-50 transition">
                <AvatarImage
                  src={icon ? URL.createObjectURL(icon) : server.logo}
                />
                <AvatarFallback>{server.name}</AvatarFallback>
              </Avatar>
              <PenBox className="absolute left-1/2 top-1/2 -translate-1/2 hidden group-hover:block transition" />
            </Label>
            {/* <p className="text-center">Logo</p> */}
          </div>
          <div className="w-full">
            <Label htmlFor="name" className="p-2">
              Server Name
            </Label>
            <Input
              id="name"
              value={name}
              className={server.isPrimary && "cursor-not-allowed"}
              readOnly={server.isPrimary}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="about" className="p-2">
            About
          </Label>
          <Textarea
            id="about"
            value={description}
            className="w-full"
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>
      </div>
      <Separator />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="" type="submit" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default ModifyServer;
