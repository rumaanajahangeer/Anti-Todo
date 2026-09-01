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

    // Safari / browsers with native HLS support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_URL;
    }
    // Chrome / Firefox / other browsers
    else if (Hls.isSupported()) {
      hls = new Hls();

      hls.loadSource(VIDEO_URL);
      hls.attachMedia(video);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }

      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-100"
      />
    </div>
  );
}

export default BackgroundVideo;
