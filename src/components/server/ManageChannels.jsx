import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableFooter,
} from "../ui/table";
import { useSelector } from "react-redux";
import { Check, EllipsisVertical, Pen, Plus, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import AddChannel from "./AddChannel";
import { ScrollArea } from "../ui/scroll-area";
import { DialogFooter } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import EditChannel from "./EditChannel";
import DeleteChannel from "./DeleteChannel";

const ManageChannels = () => {
  const channels = useSelector((state) => state.server?.channels);
  const [state, setState] = useState(null);
  const [active, setActive] = useState(null);

  if (state == "add") return <AddChannel channels={channels} />;
  if (state == "edit")
    return <EditChannel channels={channels} channel={active} />;
  if (state == "delete") return <DeleteChannel channel={active} />;

  return (
    <>
      <ScrollArea className="max-h-56">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel name</TableHead>
              <TableHead>Is Room</TableHead>
              <TableHead className="text-center">Restricted</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels?.map((c) => (
              <TableRow key={c.name}>
                <TableCell>{c.name} </TableCell>
                <TableCell>
                  {c.call && <Badge variant="secondary">Room</Badge>}
                </TableCell>
                <TableCell>
                  {c.restricted && <Check className="mx-auto" />}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical className="mx-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                      <DropdownMenuItem
                        onClick={() => {
                          setState("edit");
                          setActive(c);
                        }}
                      >
                        Edit Channel
                        <DropdownMenuShortcut>
                          <Pen />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          setState("delete");
                          setActive(c);
                        }}
                      >
                        Delete Channel
                        <DropdownMenuShortcut>
                          <Trash2 />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <DialogFooter className="bg-transparent">
        <Button variant="outline" onClick={() => setState("add")}>
          <Plus /> Add Channel
        </Button>
      </DialogFooter>
    </>
  );
};

export default ManageChannels;
