import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "./Chat";
import Room from "./Room"
import { Input } from "../ui/input";
import { HeadphoneOff, Headset, PencilLine, PencilOff } from "lucide-react";
import { setChannel } from "@/store/channelSlice";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

const Main = () => {
  const serverId = useParams().serverId;
  const channelName = useParams().channelName;
  const dispatch = useDispatch();
  const channel = useSelector((state) => state.channel);

  useEffect(() => {
    const fetchChannel = async () => {
      const { data } = await api.get(
        `server/${serverId}/channel/${channelName}`
      );
      dispatch(setChannel(data.channel));
    };
    fetchChannel();
  }, [serverId, channelName, dispatch]);
  return (
    <div className="h-screen w-full flex flex-col flex-1">
      <div className="bg-accent/50 p-4 flex items-center gap-4">
      {useIsMobile() && <SidebarTrigger />}
      {useIsMobile() && <Separator orientation="vertical"/>}
        {channel?.call ? (
          channel?.restricted ? (
            <HeadphoneOff />
          ) : (
            <Headset />
          )
        ) : channel?.restricted ? (
          <PencilOff />
        ) : (
          <PencilLine />
        )}
        <div className="flex-1">
          <h3 className="text-lg"> {channel?.name}</h3>
          <p className="text-sm text-muted-foreground">{channel?.topic}</p>
        </div>
        <Input className="sm:w-52 w-16" type="search" placeholder="Search..." />
      </div>
      {channel?.call ? <Room/> : <Chat />}
    </div>
  );
};

export default Main;
