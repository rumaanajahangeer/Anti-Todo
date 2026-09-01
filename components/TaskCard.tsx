"use client";

import { useState } from "react";
import { TaskItem } from "@/lib/types";
import { CheckCircle2, Clock, Trash2, HelpCircle, ChevronDown, ChevronUp, Layers, Check } from "lucide-react";

interface TaskCardProps {
  task: TaskItem;
  index: number;
  brutalMode?: boolean;
  onIgnore: (id: string) => void;
  onDoLater?: (id: string) => void;
  onDoNow?: (id: string) => void;
  onWhyIgnoreClick?: (task: TaskItem) => void;
}

export function TaskCard({
  task,
  index,
  brutalMode,
  onIgnore,
  onDoLater,
  onDoNow,
  onWhyIgnoreClick,
}: TaskCardProps) {
  const [expandedReason, setExpandedReason] = useState(false);

  const isHighValue = task.category === "do";
  const isLowValue = task.category === "eliminate" || task.category === "defer";
  const isLater = task.category === "later";

  const dependencies = task.dependencyUnblocked || [];

  return (
    <div
      className={`group relative rounded-xl border font-mono transition-all duration-200 ${
        task.isIgnored
          ? "bg-[#0c0c0e] border-zinc-900 opacity-40 line-through p-4"
          : isHighValue
          ? "bg-[#121215] border-emerald-500/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(16,185,129,0.06)] hover:border-emerald-500/70"
          : isLowValue
          ? "bg-[#0d0d10] border-zinc-800/80 p-4 hover:border-zinc-700 opacity-85 hover:opacity-100"
          : "bg-[#0e0e11] border-zinc-800 p-4 hover:border-zinc-700"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          {/* Number + Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold font-mono ${
                isHighValue ? "text-emerald-400" : isLowValue ? "text-zinc-500" : "text-amber-400"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${
                isHighValue
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : isLowValue
                  ? "bg-zinc-800/80 text-zinc-400 border-zinc-700"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {isHighValue ? "HIGH IMPACT" : isLowValue ? "LOW VALUE" : "DO IT LATER"}
            </span>

            {dependencies.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Layers className="h-3 w-3" />
                <span>BLOCKING OTHER WORK</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            className={`text-base sm:text-lg font-bold tracking-tight font-sans ${
              isHighValue
                ? "text-zinc-100 uppercase"
                : isLowValue
                ? "text-zinc-400"
                : "text-zinc-300"
            }`}
          >
            {isLowValue && <span className="text-rose-400/80 mr-1.5 font-mono">×</span>}
            {isLater && <span className="text-amber-400/80 mr-1.5 font-mono">○</span>}
            {task.title}
          </h4>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isLowValue && (
            <button
              onClick={() => {
                if (onWhyIgnoreClick) onWhyIgnoreClick(task);
                else setExpandedReason(!expandedReason);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Why ignore?</span>
            </button>
          )}

          {!task.isIgnored && (
            <button
              onClick={() => onIgnore(task.id)}
              title="Ignore Task"
              className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dependency Unblocked Callout */}
      {dependencies.length > 0 && (
        <div className="mt-3 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
          <div className="text-[10px] font-bold uppercase text-cyan-400">
            Unblocks Core Progress:
          </div>
          <ul className="list-disc list-inside text-[11px] text-zinc-300 font-sans">
            {dependencies.map((dep, i) => (
              <li key={i}>{dep}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Rationale text */}
      <div className="mt-3 text-xs text-zinc-300 leading-relaxed font-sans">
        <p className={isHighValue ? "text-zinc-200 font-medium" : "text-zinc-400"}>
          {brutalMode ? task.brutalReason : task.reason}
        </p>
      </div>

      {/* Inline expand/collapse reasoning for low value */}
      {isLowValue && expandedReason && (
        <div className="mt-3 p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2 text-xs font-sans">
          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            WHY SHOULD I IGNORE THIS?
          </div>
          <p className="text-zinc-300 leading-relaxed">
            "{brutalMode ? task.brutalReason : task.reason}"
          </p>
          <div className="text-[11px] text-zinc-400 font-mono">
            Recommendation: {task.recommendation}
          </div>
        </div>
      )}

      {/* Metrics & Action Bar */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
          <div>
            Impact: <span className="text-emerald-400 font-bold">{task.impact}/10</span>
          </div>
          <div>
            Urgency: <span className="text-amber-400 font-bold">{task.urgency}/10</span>
          </div>
          <div>
            Effort: <span className="text-zinc-300 font-bold">{task.effort}/10</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isHighValue && onDoNow && (
            <button
              onClick={() => onDoNow(task.id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-colors shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Start</span>
            </button>
          )}

          {isHighValue && onDoLater && (
            <button
              onClick={() => onDoLater(task.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs transition-colors"
            >
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>Later</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
