"use client";

import { Zap, Target, Flame, ArrowRight } from "lucide-react";

interface SummaryCardProps {
  verdictSummary: string;
  nextMoves: string[];
  brutalMode?: boolean;
}

export function SummaryCard({ verdictSummary, nextMoves, brutalMode }: SummaryCardProps) {
  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#121215] p-6 sm:p-8 shadow-2xl font-mono relative overflow-hidden space-y-8">
      {/* Background cyan glow */}
      <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* THE VERDICT HEADER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              {brutalMode ? <Flame className="h-4 w-4 text-rose-400" /> : <Zap className="h-4 w-4" />}
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">
              THE VERDICT
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest text-right max-w-[220px] leading-snug">
            You don&apos;t need to do more. You need to know what isn&apos;t worth doing.
          </span>
        </div>

        {/* Verdict Editorial Box */}
        <div className="p-6 rounded-xl bg-[#09090b] border border-zinc-800 space-y-3 font-sans text-base sm:text-lg leading-relaxed text-zinc-200 relative">
          <p className="italic font-medium text-zinc-100">
            "{verdictSummary}"
          </p>
          <div className="text-right text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest pt-2">
            — ANTI-TODO AI
          </div>
        </div>
      </div>

      {/* YOUR NEXT 3 MOVES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
          <Target className="h-4 w-4" />
          <span>YOUR NEXT 3 MOVES</span>
        </div>

        <div className="space-y-2.5">
          {nextMoves.slice(0, 3).map((move, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl bg-[#09090b] border border-zinc-800 text-sm text-zinc-200 group hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  0{idx + 1}
                </span>
                <span className="font-bold text-zinc-100 font-sans">{move}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
