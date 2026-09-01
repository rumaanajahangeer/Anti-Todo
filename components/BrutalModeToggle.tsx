"use client";

import { Flame, Info } from "lucide-react";

interface BrutalModeToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export function BrutalModeToggle({ value, onChange }: BrutalModeToggleProps) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
        value
          ? "bg-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-md border ${
            value
              ? "bg-rose-900/40 border-rose-500/60 text-rose-400 animate-pulse"
              : "bg-zinc-800 border-zinc-700 text-zinc-400"
          }`}
        >
          <Flame className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold tracking-wide uppercase ${
                value ? "text-rose-300" : "text-zinc-200"
              }`}
            >
              BRUTAL MODE
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                value
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}
            >
              {value ? "ON" : "OFF"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {value
              ? "AI will be direct, blunt, and cut straight through low-value excuses."
              : "Standard objective AI analysis tone."}
          </p>
        </div>
      </div>

      <div className="relative">
        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            value ? "bg-rose-600" : "bg-zinc-800 border border-zinc-700"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform transform top-1 absolute ${
              value ? "translate-x-6 bg-rose-100" : "translate-x-1 bg-zinc-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
