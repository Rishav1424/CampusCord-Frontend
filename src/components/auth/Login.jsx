import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await api.post("auth/login", { username, password });
    if (res.status == 200) {
      const token = res.data.token;
      localStorage.setItem("token", token);
      toast.success("Login Successfull");
      window.history.length > 1 ? navigate(-1) : navigate("/");
    } else {
      toast.error("Error Logging in");
    }
  };
  return (
    <form>
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Login for CampusCord
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div>
            <Label htmlFor="username" className="mb-2">
              Enter Your Username
            </Label>
            <Input
              id="username"
              autoComplete="username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              Enter Your Password
            </Label>
            <Input
              id="password"
              autoComplete="current-password"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <Separator />
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Login;
