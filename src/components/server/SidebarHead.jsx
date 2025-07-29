import React from "react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import ModifyServer from "./ModifyServer";
import ManageChannels from "./ManageChannels";
import ManageMembers from "./ManageMembers";

const SidebarHead = () => {
  const server = useSelector((state) => state.server);
  return (
    <Dialog>
      <SidebarHeader className="bg-background/75">
        <SidebarMenu>
          <SidebarMenuItem>
            <DialogTrigger asChild>
              <SidebarMenuButton size="lg" className="py-8">
                <Avatar className="size-12">
                  <AvatarImage src={server?.logo}></AvatarImage>
                  <AvatarFallback>{server?.name}</AvatarFallback>
                </Avatar>
                <h1 className="text-lg font-bold text-primary">{server?.name}</h1>
              </SidebarMenuButton>
            </DialogTrigger>
          </SidebarMenuItem>
        </SidebarMenu>
        <DialogContent className="h-96" showCloseButton={false}>
          <Tabs>
            <DialogHeader>
              <DialogTitle>
                <TabsList className="w-full bg-transparent h-10 gap-1 p-0">
                  <Separator orientation="vertical" />
                  <TabsTrigger value="server" className="data-[state=active]:bg-primary!">Server</TabsTrigger>
                  <Separator orientation="vertical" />
                  <TabsTrigger value="channels" className="data-[state=active]:bg-primary!">Channels</TabsTrigger>
                  <Separator orientation="vertical" />
                  <TabsTrigger value="members" className="data-[state=active]:bg-primary!">Members</TabsTrigger>
                  <Separator orientation="vertical" />
                </TabsList>
                <Separator />
              </DialogTitle>
            </DialogHeader>
            <TabsContent value="server" asChild>
              <ModifyServer />
            </TabsContent>
            <TabsContent value="channels" asChild>
              <ManageChannels />
            </TabsContent>
            <TabsContent value="members">
              <ManageMembers />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </SidebarHeader>
    </Dialog>
  );
};

export default SidebarHead;
