"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Terminal, Cpu } from "lucide-react";

interface AnalysisLoaderProps {
  onComplete?: () => void;
}

export function AnalysisLoader({ onComplete }: AnalysisLoaderProps) {
  const steps = [
    "Checking impact",
    "Checking dependencies",
    "Checking effort",
    "Checking urgency",
    "Finding distractions",
    "Synthesizing verdict",
  ];

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index]);
      }, (index + 1) * 600);
    });

    const finalTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, (steps.length + 1) * 600);

    return () => clearTimeout(finalTimer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl font-mono space-y-6 text-left my-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="h-4 w-4 animate-spin" />
          <span>ANALYZING YOUR WORK</span>
        </div>
        <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          ANTITODO_AI_v1.0
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = completedSteps.includes(idx);
          const isCurrent = completedSteps.length === idx;

          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">0{idx + 1}.</span>
                <span className={isDone ? "text-zinc-200" : isCurrent ? "text-cyan-400 font-semibold" : "text-zinc-600"}>
                  {step}
                </span>
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block h-2.5 w-1 bg-cyan-400"
                  />
                )}
              </div>

              <div className="flex items-center gap-1 font-mono text-zinc-500">
                <span className="text-[10px]">....................</span>
                {isDone ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Check className="h-3.5 w-3.5" />
                    <span>✓</span>
                  </span>
                ) : (
                  <span className="text-zinc-600 text-[10px]">WAIT</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden border border-zinc-800">
        <motion.div
          className="bg-cyan-400 h-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: (steps.length + 1) * 0.6, ease: "linear" }}
        />
      </div>
    </div>
  );
}
