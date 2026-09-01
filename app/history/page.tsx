"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History as HistoryIcon, ArrowRight, Trash2, Calendar } from "lucide-react";
import { DashboardMetrics, AnalysisResult } from "@/lib/types";

export default function HistoryPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((json: DashboardMetrics) => {
        if (json && Array.isArray(json.recentAnalyses) && json.recentAnalyses.length > 0) {
          setMetrics(json);
          setLoading(false);
        } else {
          // Check LocalStorage fallback
          const keys = Object.keys(localStorage).filter((k) => k.startsWith("analysis_"));
          if (keys.length > 0) {
            const recents = keys.map((k) => {
              const parsed: AnalysisResult = JSON.parse(localStorage.getItem(k) || "{}");
              return {
                id: parsed.id,
                project: parsed.project || "Untitled Project",
                projectType: parsed.projectType || "Software",
                totalTasks: parsed.totalTasks || (parsed.tasks || []).length,
                highValueCount: parsed.highValueCount || 0,
                lowValueCount: parsed.lowValueCount || 0,
                estimatedTimeSavedMinutes: parsed.estimatedTimeSavedMinutes || 0,
                createdAt: parsed.createdAt || new Date().toISOString(),
              };
            });

            setMetrics({
              totalWorkEliminatedMinutes: recents.reduce((acc, i) => acc + i.estimatedTimeSavedMinutes, 0),
              tasksIgnoredCount: 0,
              tasksCompletedCount: 0,
              totalAnalysesCount: recents.length,
              averageEliminationRate: 0,
              recentAnalyses: recents,
            });
          } else {
            setMetrics({
              totalWorkEliminatedMinutes: 0,
              tasksIgnoredCount: 0,
              tasksCompletedCount: 0,
              totalAnalysesCount: 0,
              averageEliminationRate: 0,
              recentAnalyses: [],
            });
          }
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this analysis history item?")) return;

    try {
      await fetch(`/api/history?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem(`analysis_${id}`);
    fetchHistory();
  };

  return (
    <div className="relative z-10 py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <HistoryIcon className="h-4 w-4" />
            <span>YOUR DECISIONS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold uppercase text-zinc-100">
            What you chose not to do.
          </h1>
          <p className="text-xs text-zinc-400 font-sans max-w-md">
            See your previous analyses, eliminated tasks, and decisions.
          </p>
        </div>

        <Link
          href="/analyze"
          className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold uppercase transition-colors"
        >
          Analyze Tasks →
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500">Loading history...</div>
      ) : !metrics || metrics.recentAnalyses.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl space-y-4">
          <div className="text-sm text-zinc-300 font-bold uppercase">NOTHING HERE YET</div>
          <p className="text-xs text-zinc-500 font-sans max-w-sm mx-auto">
            Your first analysis will appear here.
          </p>
          <Link
            href="/analyze"
            className="inline-block px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-cyan-400 font-bold uppercase hover:bg-zinc-800 transition-colors"
          >
            Analyze your tasks →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {metrics.recentAnalyses.map((item) => {
            const dateStr = new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const hrs = Math.floor(item.estimatedTimeSavedMinutes / 60);
            const mins = item.estimatedTimeSavedMinutes % 60;

            return (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl bg-[#121215] border border-zinc-800 hover:border-cyan-500/50 transition-all gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{dateStr}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-semibold">{item.projectType}</span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                    {item.project}
                  </h3>

                  <div className="text-xs text-zinc-400 font-sans">
                    <span className="font-mono text-zinc-200">{item.totalTasks} tasks</span> →{" "}
                    <span className="font-mono font-bold text-emerald-400">{item.highValueCount} worth doing</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right mr-2">
                    <div className="text-[10px] text-zinc-500 uppercase">Time Saved</div>
                    <div className="text-sm font-bold text-cyan-400 font-mono">
                      {hrs}h {mins}m
                    </div>
                  </div>

                  <Link
                    href={`/analyze?id=${item.id}`}
                    className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-cyan-400 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Past analyses →</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete History Entry"
                    className="p-2 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
