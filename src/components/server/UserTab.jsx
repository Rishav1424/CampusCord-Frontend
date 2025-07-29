import React from "react";
import { SidebarFooter, SidebarMenuButton } from "../ui/sidebar";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

const UserTab = () => {
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.server?.isAdmin);

  return (
    <SidebarFooter>
      <SidebarMenuButton size="lg" className="py-8" variant="outline" asChild tooltip={"tt"}>
        <Link to="/">
          <Avatar className="size-10 border border-primary" >
            <AvatarImage src={user?.avatar}></AvatarImage>
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-primary font-bold">
              {user?.username}{" "}
              <Badge variant={role ? "default" : "outline"}>
                {role ? "admin" : "member"}
              </Badge>
            </h3>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarFooter>
  );
};

export default UserTab;
