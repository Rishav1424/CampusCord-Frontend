import React from "react";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Tabs defaultValue="login">
        <TabsList className="w-full h-10 gap-1 p-0">
          <TabsTrigger
            value="login"
            className="px-8 data-[state=active]:bg-primary!"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="px-8 data-[state=active]:bg-primary!"
          >
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login value="login" />
        </TabsContent>
        <TabsContent value="register">
          <Register value="register" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
