import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "../ui/sidebar";
import SidebarMain from "./SidebarMain";
import SidebarHead from "./SidebarHead";
import UserTab from "./UserTab";

const CustomSidebar = () => {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHead/>
      <SidebarSeparator/>
      <SidebarContent>
        <SidebarMain />
      </SidebarContent>
      <UserTab/>
    </Sidebar>
  );
};

export default CustomSidebar
