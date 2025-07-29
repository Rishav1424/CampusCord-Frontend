import React, { useEffect, useRef, useState } from "react";
import { Room } from "livekit-client";
import api from "@/lib/api";
import { useParams } from "react-router-dom";

const Component = () => {
  const { serverId, channelName } = useParams();
  const [token, setToken] = useState("");
  const [livekitUrl, setLivekitUrl] = useState("");
  const [room, setRoom] = useState(null);
  const [_, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.post(
        `server/${serverId}/channel/${channelName}/joinroom`
      );
      console.log(data);
      setToken(data.token);
      setLivekitUrl(data.url);
    })();
  }, [channelName, serverId]);

  useEffect(() => {
    if (!token) return;
    const connectRoom = async () => {
      const room = new Room();
      try {
        await room.connect(livekitUrl, token, {
          audio: true,
          video: true,
        });

        setRoom(room);
        setConnected(true);

        room.on("trackSubscribed", (track, publication, participant) => {
          if (
            track.kind === "video" &&
            participant.identity !== room.localParticipant.identity
          ) {
            track.attach(remoteVideoRef.current);
          }
        });

        // Attach local video
        room.localParticipant.videoTracks?.forEach((pub) => {
          const track = pub.track;
          if (track) track.attach(localVideoRef.current);
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    connectRoom();

    return () => {
      room?.disconnect();
    };
  }, [livekitUrl, room, token]);

  const toggleMic = () => {
    if (!room) return;
    const enabled = !micEnabled;
    setMicEnabled(enabled);
    room.localParticipant.setMicrophoneEnabled(enabled);
  };

  const toggleCam = () => {
    if (!room) return;
    const enabled = !camEnabled;
    setCamEnabled(enabled);
    room.localParticipant.setCameraEnabled(enabled);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div>
          <h3 className="text-white mb-1">Local Video</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="rounded w-80 h-56 bg-black"
          />
        </div>
        <div>
          <h3 className="text-white mb-1">Remote Video</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            className="rounded w-80 h-56 bg-black"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={toggleMic}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {micEnabled ? "Mute Mic" : "Unmute Mic"}
        </button>
        <button
          onClick={toggleCam}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {camEnabled ? "Turn Off Cam" : "Turn On Cam"}
        </button>
      </div>
    </div>
  );
};

export default Component;
