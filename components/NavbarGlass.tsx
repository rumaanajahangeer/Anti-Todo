"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export function NavbarGlass() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-20 px-6 py-6 w-full"
    >
      <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
        {/* Left side */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">ANTI-TODO</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
            <Link href="/" className="hover:text-white transition-colors duration-300">
              Dashboard
            </Link>
            <Link href="/analyze" className="hover:text-white transition-colors duration-300">
              Analyze
            </Link>
            <Link href="/history" className="hover:text-white transition-colors duration-300">
              History
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link href="/history" className="text-white hover:text-white/80 transition-colors text-sm font-medium cursor-pointer">
            History
          </Link>
          <Link href="/analyze" className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer">
            Analyze Tasks →
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
