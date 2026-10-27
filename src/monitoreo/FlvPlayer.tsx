import React, { useEffect, useRef } from "react";
import flvjs from "flv.js";

export const FlvPlayer = ({
  url,
  setSuccessVideo,
  setLoadingVideo
}: {
  url: string;
  setSuccessVideo: (e: any) => void;
  setLoadingVideo: (e: any) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<flvjs.Player | null>(null);

  useEffect(() => {
    if (!url) return;
    if (!flvjs.isSupported()) return;

    // 🔥 destruir player anterior si existe
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    const videoElement = videoRef.current;

    if (!videoElement) return;

    const player = flvjs.createPlayer({
      type: "flv",
      url,
      isLive: true
    });

    player.attachMediaElement(videoElement);
    player.load();
    player.on(flvjs.Events.ERROR,() => {
      setLoadingVideo(false)
      setSuccessVideo(false)
    });

    player.on(flvjs.Events.LOADING_COMPLETE, () => {
      setLoadingVideo(false)
      setSuccessVideo(true)
      videoElement?.play().catch(() => { });
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [url]);

  return (
    <video
      ref={videoRef}
      autoPlay
      className="w-full h-11rem"
      onDoubleClick={() => console.log("Abrir video")}
    />
  );
}