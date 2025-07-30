// socket.js
import { io } from "socket.io-client";

let socket = null;

export function connectSocket(serverId) {
  const backendUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000";
  socket = io(`${backendUrl}/server/${serverId}`, {
    auth: { token: localStorage.getItem("token") },
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}

export function addListener(event, callback) {
  if (socket) {
    socket.on(event, callback);
  }
}

export function emitSocketEvent(event, ...data) {
  if (socket) {
    socket.emit(event, ...data);
  }
}
