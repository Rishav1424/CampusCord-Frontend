import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Server from "./pages/Server";
import Channel from "./components/channel/Main";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import Auth from "./pages/Auth";
import Redirect from "./components/channel/Redirect";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="server/:serverId" element={<Server />}>
            <Route index element={<Redirect/>} />
            <Route path=":channelName" element={<Channel />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster />
  </Provider>
);
