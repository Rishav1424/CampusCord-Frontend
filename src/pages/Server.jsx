import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setServer } from "../store/serverSlice";
import { addListener, connectSocket, disconnectSocket } from "@/lib/socket";
import { addLike, addMessage, removeLike } from "@/store/channelSlice";
import Sidebar from "../components/server/Sidebar";

const Server = () => {
  const serverId = useParams().serverId;
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    (async () => {
      connectSocket(serverId);

      const { data: serverResponse } = await api.get(`/server/${serverId}`);
      dispatch(setServer(serverResponse.server));

      addListener("newMessage", (message) => {
        console.log(message);
        message.self = message.createdBy.id == userId;
        dispatch(addMessage(message));
      });

      addListener("like", (messageId, userId) => {
        console.log("Got like");
        dispatch(addLike({ messageId, self: userId == userId }));
      });

      addListener("dislike", (messageId, userId) => {
        console.log("Got dislike");
        dispatch(removeLike({ messageId, self: userId == userId }));
      });
    })();

    return () => {
      disconnectSocket();
    };
  }, [serverId, dispatch, userId]);

  return (
    <SidebarProvider>
      <Sidebar />
      <Outlet />
    </SidebarProvider>
  );
};

export default Server;
