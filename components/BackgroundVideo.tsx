"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

const VIDEO_URL =
  "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | undefined;

    video.muted = true;
    video.playsInline = true;

    // Prefer hls.js for Chrome, Edge, Firefox, etc.
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
      });

      hls.loadSource(VIDEO_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((error) => {
          console.error("HLS playback failed:", error);
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS error:", data);
      });
    }
    // Use native HLS for Safari / compatible browsers
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_URL;

      video.play().catch((error) => {
        console.error("Native HLS playback failed:", error);
      });
    } else {
      console.error("HLS is not supported by this browser.");
    }

    return () => {
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover opacity-100"
      />
    </div>
  );
}

export default BackgroundVideo;