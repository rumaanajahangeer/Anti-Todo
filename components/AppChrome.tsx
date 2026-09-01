"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { NavbarGlass } from "@/components/NavbarGlass";
import { PageVideoBackground } from "@/components/PageVideoBackground";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isVideoPage = pathname.startsWith("/analyze") || pathname.startsWith("/history");

  if (isLanding) {
    return <>{children}</>;
  }

  if (isVideoPage) {
    return (
      <div className="relative min-h-screen bg-black text-white">
        <PageVideoBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <NavbarGlass />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 py-6 text-center text-xs font-body text-white/40">
            <div className="mx-auto max-w-6xl px-6 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>ANTI-TODO — Less busywork. More meaningful work.</span>
              <span>Do less. Do what matters.</span>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-800/60 py-6 text-center text-xs font-mono text-zinc-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ANTI-TODO — Less busywork. More meaningful work.</span>
          <span>Do less. Do what matters.</span>
        </div>
      </footer>
    </>
  );
}
