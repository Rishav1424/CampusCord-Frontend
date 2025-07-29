import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import serverReducer from "./serverSlice";
import channelReducer from "./channelSlice";
import socketReducer from "./socketSlice";

// Create a Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
    server: serverReducer,
    channel: channelReducer,
    socket: socketReducer
  },
});
