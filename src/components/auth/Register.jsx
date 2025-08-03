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

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await api.post("auth/register", {
      username,
      password,
      email,
      name,
    });
    if (res.status == 201) {
      toast.success(
        "A verification link has been sent to your email /n verify within 5 minutes and then login"
      );
    }
  };
  return (
    <form>
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Register for CampusCord
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div>
            <Label htmlFor="name" className="mb-2">
              Enter Your Name
            </Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <Label htmlFor="username" className="mb-2">
              Provide an unique username
            </Label>
            <Input
              id="username"
              autoComplete="username"
              placeholder="Unique Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-2">
              Provide your Institute Email
            </Label>
            <Input
              id="email"
              type="email"
                autoComplete="email"
              placeholder="Institute Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              Set a password
            </Label>
            <Input
              id="password"
              autoComplete="current-password"
              placeholder="choose a password"
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
          <Button variant="default" className="w-full" onClick={handleRegister}>
            Register
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Register;
