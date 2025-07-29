import React from "react";
import { useSelector } from "react-redux";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "../ui/sidebar";
import { NavLink } from "react-router-dom";
import {
  HeadphoneOff,
  Headset,
  Info,
  PencilLine,
  PencilOff,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const SidebarMain = () => {
  const channels = useSelector((state) => state.server?.channels);
  const isAdmin = useSelector((state) => state.server?.isAdmin);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Channels</SidebarGroupLabel>
      <SidebarMenu>
        {channels?.map((c) => (
          <SidebarMenuItem key={c.name} className="group">
            <SidebarMenuButton
              tooltip={c.name}
              size="md"
              className="[.active]:bg-accent"
              asChild
            >
              <NavLink to={`./${c.name}`} className="px-4 py-2">
                {c.call ? (
                  c.restricted ? (
                    <HeadphoneOff />
                  ) : (
                    <Headset />
                  )
                ) : c.restricted ? (
                  <PencilOff />
                ) : (
                  <PencilLine />
                )}
                <span className="ml-2">{c.name}</span>
              </NavLink>
            </SidebarMenuButton>
            {isAdmin && (
              <Popover>
                <SidebarMenuAction showOnHover asChild>
                  <PopoverTrigger asChild>
                    <Info/>
                  </PopoverTrigger>
                </SidebarMenuAction>
                <PopoverContent align="start">
                  {c.topic}
                </PopoverContent>
              </Popover>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarMain;
