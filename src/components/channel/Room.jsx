import { useState, useEffect, useCallback } from "react";
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  useConnectionState,
  TrackToggle,
  DisconnectButton,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import api from "@/lib/api";
import { useParams } from "react-router-dom";

export default function App() {
  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );
  const { serverId, channelName } = useParams();

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
      if (room && room.isConnected) {
        console.log("Disconnecting from room");
        room.disconnect();
      }
    };
  }, [joinRoom, room]);

  if (useConnectionState(room) === "disconnected") return;
  return (
    // Wrap the entire app with the RoomContext to make the room available to all childdiv components.
    <RoomContext.Provider value={room}>
      {/* <span>{connected}</span> */}
      <div
        data-lk-theme="default"
        className="flex-1 basis-0.5 overflow-auto flex flex-col"
        style={{
          "--lk-control-active-bg": "var(--primary)",
          "--lk-accent-bg": "var(--primary)",
        }}
      >
        <MyVideoConference />
        <div className="flex justify-center gap-4 p-4">
          <TrackToggle source={Track.Source.Microphone}>Microphone</TrackToggle>
          <TrackToggle source={Track.Source.Camera}>Camera</TrackToggle>
          <TrackToggle source={Track.Source.ScreenShare}>
            Share Screen
          </TrackToggle>
        </div>
        <RoomAudioRenderer />
        {/* <ControlBar /> */}
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

  console.log("Tracks:", tracks);

  return (
    <div className="flex-1 basis-5 relative overflow-auto">
      <GridLayout tracks={tracks}>
        <ParticipantTile className="after:border-primary! flex items-center" />
      </GridLayout>
    </div>
  );
}
