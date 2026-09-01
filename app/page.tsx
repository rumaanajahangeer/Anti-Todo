"use client";

import BackgroundVideo from "@/components/BackgroundVideo";
import { NavbarGlass } from "@/components/NavbarGlass";
import { HeroHero } from "@/components/HeroHero";
import CtaFooter from "@/components/CtaFooter";

export default function Dashboard() {
  return (
    <main className="relative bg-black min-h-screen w-full flex flex-col overflow-x-hidden selection:bg-white selection:text-black">
      {/* Hero Section Container */}
      <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
        <BackgroundVideo />
        <NavbarGlass />
        <HeroHero />
      </div>

      {/* Cinematic CTA + Footer Section */}
      <CtaFooter />
    </main>
  );
}
