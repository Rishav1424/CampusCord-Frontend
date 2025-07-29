import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";
import api from "@/lib/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { demoteMember, promoteMember } from "@/store/serverSlice";

const ManageMembers = () => {
  const members = useSelector((state) => state.server.members);
  const serverId = useParams().serverId;
  const dispatch = useDispatch();

  const promote = (member) => async () => {
    const response =await api.patch(`server/${serverId}/promote/${member.id}`);
    if (response.status == 200) {
      toast.success("Member promoted");
      dispatch(promoteMember({ id: member.id }));
    }
  };
  const demote = (member) => async () => {
    const response = await api.patch(`server/${serverId}/demote/${member.id}`);
    if (response.status == 200) {
      toast.success("Member demoted");
      dispatch(demoteMember({ id: member.id }));
    }
  };
  return (
    <>
      <DialogDescription>Manage Members</DialogDescription>
      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-center">Is Admin</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.username[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{member.username}</TableCell>
                <TableCell>
                  {member.admin ? (
                    <Badge className="mx-auto block">Admin</Badge>
                  ) : (
                    <Badge className="mx-auto block" variant="outline">
                      Member
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {member.admin ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mx-auto flex"
                      onClick={demote(member)}
                    >
                      <ArrowBigDownDash />
                      Demote
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mx-auto flex"
                      onClick={promote(member)}
                    >
                      <ArrowBigUpDash />
                      Promote
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default ManageMembers;
