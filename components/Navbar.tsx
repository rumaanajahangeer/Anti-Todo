"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, History, LayoutDashboard, PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Analyze", href: "/analyze", icon: PlusCircle },
    { label: "History", href: "/history", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 font-mono">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
            <Zap className="h-3.5 w-3.5 fill-cyan-400/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-zinc-100 uppercase">
              ANTI<span className="text-cyan-400">-</span>TODO
            </span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none">
              Task Elimination
            </span>
          </div>
        </Link>

        {/* Desktop Nav: Dashboard, Analyze, History */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md transition-all ${
                  isActive
                    ? "bg-zinc-800/90 text-cyan-400 border border-zinc-700/80 font-bold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="h-4 w-px bg-zinc-800 mx-2" />

          <Link
            href="/analyze"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)]"
          >
            <span>Analyze Tasks →</span>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0c0c0e] px-4 py-3 space-y-2 font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  isActive
                    ? "bg-zinc-800 text-cyan-400 border border-zinc-700 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/analyze"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center py-2.5 rounded-md bg-cyan-500 text-zinc-950 font-bold uppercase"
          >
            Analyze Tasks →
          </Link>
        </div>
      )}
    </header>
  );
}
