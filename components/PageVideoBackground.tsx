"use client";

import BackgroundVideo from "@/components/BackgroundVideo";

export function PageVideoBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <BackgroundVideo />
      <div
        className="absolute top-0 left-0 right-0 z-[1]"
        style={{ height: "200px", background: "linear-gradient(to bottom, black, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-[1]"
        style={{ height: "200px", background: "linear-gradient(to top, black, transparent)" }}
      />
    </div>
  );
}
