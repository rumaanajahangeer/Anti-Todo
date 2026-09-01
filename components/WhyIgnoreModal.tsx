"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, Flame, ArrowRight, CheckCircle2 } from "lucide-react";
import { TaskItem } from "@/lib/types";

interface WhyIgnoreModalProps {
  task: TaskItem | null;
  brutalMode?: boolean;
  onClose: () => void;
  onConfirmIgnore?: (taskId: string) => void;
}

export function WhyIgnoreModal({ task, brutalMode, onClose, onConfirmIgnore }: WhyIgnoreModalProps) {
  if (!task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg rounded-xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl font-mono relative overflow-hidden"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-400">
                {brutalMode ? <Flame className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Why Should I Ignore This?
                </h3>
                <span className="text-[11px] text-zinc-400 truncate max-w-[280px] block">
                  "{task.title}"
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Rationale Content */}
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800/80 space-y-2">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span>AI Rationale</span>
                {brutalMode && (
                  <span className="text-rose-400 text-[9px] px-1 bg-rose-950 border border-rose-800 rounded">
                    BRUTAL
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans font-medium">
                "{brutalMode ? task.brutalReason : task.reason}"
              </p>
            </div>

            {/* Impact metrics breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Impact</div>
                <div className="text-sm font-bold text-rose-400 mt-0.5">{task.impact}/10</div>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Urgency</div>
                <div className="text-sm font-bold text-zinc-400 mt-0.5">{task.urgency}/10</div>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Est. Time Saved</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">{task.effort * 30}m</div>
              </div>
            </div>

            <div className="p-3 rounded bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
              <span className="font-semibold text-cyan-400">Recommendation:</span>
              <p className="text-[11px] text-zinc-300 font-sans">{task.recommendation}</p>
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Keep Task
            </button>

            {onConfirmIgnore && (
              <button
                onClick={() => {
                  onConfirmIgnore(task.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirm: Ignore Task</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
