"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Check, X, Sparkles, Filter, ShieldAlert } from "lucide-react";

export function HeroAnimation() {
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input");

  const sampleTasks = [
    { title: "Fix authentication", worth: true, reason: "Core blocker" },
    { title: "Rewrite README", worth: false, reason: "Documentation overhead" },
    { title: "Deploy database", worth: true, reason: "Required for launch" },
    { title: "Change button animation", worth: false, reason: "Cosmetic polish" },
    { title: "Rename variables", worth: false, reason: "Non-blocking refactor" },
    { title: "Finish API integration", worth: true, reason: "Core functionality" },
    { title: "Update landing header", worth: false, reason: "Minor copy edit" },
    { title: "Add loading spinner", worth: false, reason: "Nice-to-have" },
    { title: "Fix checkout bug", worth: true, reason: "Prevents revenue" },
    { title: "Reformat CSS files", worth: false, reason: "Pure vanity" },
    { title: "Clean up console logs", worth: false, reason: "Low impact" },
    { title: "Refactor router types", worth: false, reason: "Premature optimization" },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep("analyzing"), 2400);
    const timer2 = setTimeout(() => setStep("result"), 5000);
    const timer3 = setTimeout(() => setStep("input"), 10500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [step]);

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl border border-zinc-800 bg-[#121215] p-5 sm:p-6 shadow-2xl relative overflow-hidden font-mono">
      {/* Background glow overlay */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      {/* Top Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Task Pipeline Simulator
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            {step === "input" && "INPUT: 12 TASKS"}
            {step === "analyzing" && "RUNNING AI FILTER..."}
            {step === "result" && "ELIMINATION COMPLETE"}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>UNFILTERED BACKLOG</span>
              <span className="text-zinc-500">12 Items</span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-hidden pr-1">
              {sampleTasks.slice(0, 6).map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300"
                >
                  <span className="truncate">{t.title}</span>
                  <span className="text-[10px] text-zinc-500">PENDING</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col items-center justify-center text-zinc-500 text-xs gap-1">
              <ArrowDown className="h-4 w-4 animate-bounce text-cyan-400" />
              <span className="text-[11px] text-cyan-400">Ready for AI Task Elimination</span>
            </div>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing-step"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="py-8 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
              <Filter className="h-6 w-6 text-cyan-400 absolute" />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-semibold text-zinc-100 uppercase tracking-wide">
                Analyzing Task Value & Dependencies
              </div>
              <p className="text-xs text-zinc-400">Evaluating impact score, urgency, and project blockers...</p>
            </div>

            <div className="w-full max-w-xs bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                className="bg-cyan-400 h-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="result-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <Check className="h-4 w-4" />
                  <span>DO THIS (4)</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-emerald-400">4</div>
                <div className="text-[10px] text-emerald-300/70">High-value core tasks</div>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
                  <X className="h-4 w-4" />
                  <span>ELIMINATE (8)</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-rose-400">8</div>
                <div className="text-[10px] text-rose-300/70">Not worth your time</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] text-zinc-400 tracking-wider uppercase font-semibold">
                Sample Breakdown
              </div>
              <div className="space-y-1 text-xs">
                {sampleTasks.slice(0, 5).map((t, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-1.5 rounded border transition-colors ${
                      t.worth
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-500 line-through"
                    }`}
                  >
                    <span className="truncate">{t.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                        t.worth
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 text-rose-400 no-underline"
                      }`}
                    >
                      {t.worth ? "KEEP" : "IGNORE"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs">
              <span className="text-zinc-300">Estimated Time Saved:</span>
              <span className="font-bold text-cyan-400">6h 20m</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex justify-between items-center text-[10px] text-zinc-500">
        <span>ANTITODO_ENGINE_v1.0</span>
        <button
          onClick={() => {
            if (step === "input") setStep("analyzing");
            else if (step === "analyzing") setStep("result");
            else setStep("input");
          }}
          aria-label="Replay animation cycle"
          className="hover:text-cyan-400 transition-colors cursor-pointer"
        >
          [ Replay Cycle ]
        </button>
      </div>
    </div>
  );
}
