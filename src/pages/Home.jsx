import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Handshake, PenBox } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import api from "@/lib/api";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [primary, setPrimary] = useState();
  const [servers, setServers] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: serverResponse } = await api.get("server");
      setPrimary(serverResponse.primaryServer);
      setServers(serverResponse.secondaryServers);
    })();
  }, [dispatch]);

  const joinServer = (serverId) => async (e) => {
    e.stopPropagation();
    const res = await api.post(`server/${serverId}/join`);
    if (res.status == 201) {
      toast.success("server joined successfully");
      setServers((servers) => {
        const updates = [...servers];
        let target = updates.find((server) => server.id === serverId);
        if (target) target.joined = true;
        else setPrimary((server) => ({ ...server, joined: true }));
        return updates;
      });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <main className="h-screen flex py-12">
      <div className="px-20 basis-1/2 flex flex-col gap-10">
        <div>
          <Handshake />
          Hii {user?.username}
          <h2 className="text-6xl">Welcome to</h2>
          <h1 className="text-primary text-6xl font-bold">CampusCord</h1>
        </div>
        <div>
          {primary && (
            <>
              <h4 className="underline text-lg mb-4">Your College Server</h4>
              <Link
                to={`server/${primary.id}`}
                onClick={(e) => {
                  primary.joined || e.preventDefault();
                }}
              >
                <Card className="w-fit flex flex-row p-2 px-4 gap-6 items-center mb-5">
                  <Avatar className="size-20 border border-primary">
                    <AvatarImage src={primary.logo} />
                    <AvatarFallback>{primary.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="text-xl font-bold mb-1">{primary.name}</h5>
                    <p className="text-muted-foreground">
                      {primary.description}
                    </p>
                    <Badge
                      variant={primary.joined ? "outline" : "default"}
                      onClick={joinServer(primary.id)}
                      cursor="pointer"
                    >
                      {primary.joined ? "joined" : "join"}
                    </Badge>
                  </div>
                </Card>
              </Link>
            </>
          )}
          <h4 className="underline font-thin mb-4">Explore other Servers</h4>
          <ScrollArea>
            <div className="flex items-start gap-6">
              {servers.map((server) => (
                <div
                  className="flex flex-col gap-2 items-center"
                  key={server.id}
                >
                  <Link
                    to={"server/" + server.id}
                    onClick={(e) => {
                      primary.joined || e.preventDefault();
                    }}
                  >
                    <Avatar className="size-16 border ">
                      <AvatarImage src={server.logo} />
                      <AvatarFallback>{server.name[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <h5 className="text-sm line-clamFp-1">{server.name}</h5>
                  <p className="text-muted-foreground">{server.description}</p>
                  <Badge
                    variant={server.joined ? "outline" : "default"}
                    onClick={joinServer(server.id)}
                    className="cursor-pointer"
                  >
                    {server.joined ? "joined" : "join"}
                  </Badge>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="px-8 basis-1/2">{user && <Profile user={user} />}</div>
    </main>
  );
};

const Profile = ({ user }) => {
  const [name, setName] = useState(user?.name);
  const [username, setUsername] = useState(user?.username);
  const [emaii, setEmail] = useState(user?.email);
  const [icon, setIcon] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await api.patch("auth/me", { name, username });
    if (response.status == 201) {
      console.log(icon?.type);
      if (icon) {
        try {
          await fetch(response.data.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "image/*",
            },
            body: icon,
          });
          toast.success("Profile details updated successfully");
          dispatch(setUser(response.data.user));
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  };
  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const reset = () => {
    setName(user.name);
    setUsername(user.username);
    setIcon(null);
  };

  return (
    <Card className="size-full max-w-lg mx-auto px-8">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 justify-between flex flex-col">
        <Separator />
        <Label className="group relative mx-auto w-fit mt-4">
          <Input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setIcon(e.target.files[0])}
          />
          <Avatar className="size-24 group-hover:opacity-50 transition">
            <AvatarImage
              src={icon ? URL.createObjectURL(icon) : user?.avatar}
            />
            <AvatarFallback>{user?.username}</AvatarFallback>
          </Avatar>
          <PenBox className="absolute left-1/2 top-1/2 -translate-1/2 hidden group-hover:block transition" />
        </Label>
        <p className="w-fit mx-auto mb-4">Avatar</p>
        <div className="w-full mb-2">
          <Label htmlFor="username" className="p-2">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="w-full mb-2">
          <Label htmlFor="name" className="p-2">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full mb-4">
          <Label htmlFor="email" className="p-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={emaii}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
          />
        </div>
        <Separator />
      </CardContent>
      <CardFooter className="gap-2 justify-between flex-col">
        {name != user.name || username != user.username || icon ? (
          <Button
            variant=""
            type="submit"
            onClick={handleSubmit}
            className="w-full"
          >
            Save Changes
          </Button>
        ) : (
          <Button variant="destructive" onClick={Logout} className="w-full">
            Logout
          </Button>
        )}
        <Button variant="secondary" className="w-full" onClick={reset}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Home;
