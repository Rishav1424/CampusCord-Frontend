import { useState, useEffect, useCallback } from "react";
import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  useConnectionState,
  TrackToggle,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import api from "@/lib/api";
import { useParams } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export default function App() {
  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );
  const { serverId, channelName } = useParams();
  const isMobile = useIsMobile();

  const joinRoom = useCallback(async () => {
    try {
      const response = await api.post(
        `server/${serverId}/channel/${channelName}/joinroom`
      );
      room.connect(response.data.url, response.data.token, {
        autoSubscribe: true,
      });
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  }, [serverId, channelName, room]);

  useEffect(() => {
    joinRoom();

    // Cleanup function to disconnect when the component unmounts.
    return () => {
      console.log("Disconnecting from room");
      room.disconnect();
      console.log("Disconnected");
    };
  }, []);

  if (useConnectionState(room) === "disconnected") return;
  return (
    // Wrap the entire app with the RoomContext to make the room available to all childdiv components.
    <RoomContext.Provider value={room}>
      <div
        data-lk-theme="default"
        className="flex-1 basis-0.5 overflow-auto flex flex-col"
      >
        <MyVideoConference />
        <Separator/>
        <div className="flex justify-center gap-4 p-4">
          <TrackToggle
            source={Track.Source.Microphone}
            className="[&[aria-pressed=true]]:bg-primary! hover:[&[aria-pressed=true]]:bg-primary/75!"
          >
            {!isMobile && "Microphone"}
          </TrackToggle>
          <TrackToggle
            source={Track.Source.Camera}
            className="[&[aria-pressed=true]]:bg-primary! hover:[&[aria-pressed=true]]:bg-primary/75!"
          >
            {!isMobile && "Camera"}
          </TrackToggle>
          <TrackToggle
            source={Track.Source.ScreenShare}
            className="[&[aria-pressed=true]]:bg-primary! hover:[&[aria-pressed=true]]:bg-primary/75!"
          >
            {!isMobile && "Share Screen"}
          </TrackToggle>
        </div>
        <RoomAudioRenderer />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="flex-1 basis-5 relative overflow-auto">
      <GridLayout tracks={tracks}>
        <ParticipantTile className="after:border-primary! flex items-center" />
      </GridLayout>
    </div>
  );
}
