import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import { ScrollArea } from "../ui/scroll-area";
import { emitSocketEvent } from "@/lib/socket";
import Input from "./Input";

const Chat = () => {
  const restricted = useSelector((state) => state.channel?.restricted);
  const channelName = useSelector((state) => state.channel?.name);
  const messages = useSelector((state) => state.channel?.messages);
  const isAdmin = useSelector((state) => state.server?.isAdmin);

  useEffect(() => {
    if (!channelName) return;
    console.log("mounted" + channelName);
    emitSocketEvent("joinChannel", channelName);
    return () => {
      console.log("unmounted" + channelName);
      emitSocketEvent("leaveChannel", channelName);
    };
  }, [channelName]);

  return (
    <div className="w-full flex flex-col flex-1">
      <ScrollArea className="min-h-0 grow basis-2xs">
        {messages?.map((message) => (
          <Message message={message} key={message.id} />
        ))}
      </ScrollArea>
      {isAdmin || !restricted ? (
        <Input />
      ) : (
        <p className="text-accent mx-auto mb-4">Only admins can send message</p>
      )}
    </div>
  );
};

export default Chat;
