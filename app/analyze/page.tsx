"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TaskInput } from "@/components/TaskInput";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { PrioritySection } from "@/components/PrioritySection";
import { SummaryCard } from "@/components/SummaryCard";
import { WhyIgnoreModal } from "@/components/WhyIgnoreModal";
import { BrutalModeToggle } from "@/components/BrutalModeToggle";
import { AnalysisResult, TaskItem } from "@/lib/types";
import { ArrowLeft, Clock, Share2, Sparkles, Zap, Layers } from "lucide-react";
import Link from "next/link";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryId = searchParams.get("id");

  const [viewState, setViewState] = useState<"input" | "loading" | "result">("input");
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [pendingResult, setPendingResult] = useState<AnalysisResult | null>(null);
  const [selectedWhyTask, setSelectedWhyTask] = useState<TaskItem | null>(null);
  const [brutalMode, setBrutalMode] = useState(false);

  // Load existing analysis if `?id=...` parameter exists in URL
  useEffect(() => {
    if (queryId) {
      // Check local storage backup
      const local = localStorage.getItem(`analysis_${queryId}`);
      if (local) {
        try {
          const parsed: AnalysisResult = JSON.parse(local);
          setData(parsed);
          setBrutalMode(parsed.brutalMode);
          setViewState("result");
          return;
        } catch (e) {
          console.error(e);
        }
      }

      // Fetch from API endpoint
      fetch(`/api/history?id=${queryId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((json: AnalysisResult) => {
          setData(json);
          setBrutalMode(json.brutalMode);
          setViewState("result");
        })
        .catch((err) => {
          console.error(err);
          setViewState("input");
        });
    }
  }, [queryId]);

  const handleStartAnalysis = async (payload: {
    project: string;
    projectType: string;
    context: string;
    tasks: string[];
    brutalMode: boolean;
  }) => {
    setViewState("loading");
    setBrutalMode(payload.brutalMode);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze tasks");
      }

      const result: AnalysisResult = await res.json();
      setPendingResult(result);
      // Save locally
      localStorage.setItem(`analysis_${result.id}`, JSON.stringify(result));
    } catch (err) {
      console.error(err);
      alert("Error analyzing tasks. Please try again.");
      setViewState("input");
    }
  };

  const handleLoaderComplete = () => {
    if (pendingResult) {
      setData(pendingResult);
      setViewState("result");
    }
  };

  const handleReset = () => {
    setData(null);
    setPendingResult(null);
    setViewState("input");
    router.push("/analyze");
  };

  // Task Action Handlers
  const handleIgnoreTask = (taskId: string) => {
    setData((prev) => {
      if (!prev) return null;
      const updated = prev.tasks.map((t) => (t.id === taskId ? { ...t, isIgnored: true } : t));
      const newObj = { ...prev, tasks: updated };
      if (prev.id) localStorage.setItem(`analysis_${prev.id}`, JSON.stringify(newObj));
      return newObj;
    });
  };

  const handleRestoreTask = (taskId: string) => {
    setData((prev) => {
      if (!prev) return null;
      const updated = prev.tasks.map((t) => (t.id === taskId ? { ...t, isIgnored: false } : t));
      const newObj = { ...prev, tasks: updated };
      if (prev.id) localStorage.setItem(`analysis_${prev.id}`, JSON.stringify(newObj));
      return newObj;
    });
  };

  const handleDoLaterTask = (taskId: string) => {
    setData((prev) => {
      if (!prev) return null;
      const updated = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, category: "later" as const } : t
      );
      const newObj = { ...prev, tasks: updated };
      if (prev.id) localStorage.setItem(`analysis_${prev.id}`, JSON.stringify(newObj));
      return newObj;
    });
  };

  const handleDoNowTask = (taskId: string) => {
    setData((prev) => {
      if (!prev) return null;
      const updated = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, category: "do" as const } : t
      );
      const newObj = { ...prev, tasks: updated };
      if (prev.id) localStorage.setItem(`analysis_${prev.id}`, JSON.stringify(newObj));
      return newObj;
    });
  };

  const activeTasks = data ? data.tasks.filter((t) => !t.isIgnored) : [];
  const highValueCount = activeTasks.filter((t) => t.category === "do").length;
  const lowValueCount = activeTasks.filter((t) => t.category === "eliminate" || t.category === "defer").length;
  const laterCount = activeTasks.filter((t) => t.category === "later").length;

  const timeSavedMinutes = data
    ? data.tasks
        .filter((t) => t.isIgnored || t.category === "eliminate" || t.category === "defer")
        .reduce((acc, t) => acc + t.effort * 35, 0)
    : 0;

  const hoursSaved = Math.floor(timeSavedMinutes / 60);
  const minsSaved = timeSavedMinutes % 60;

  return (
    <div className="relative z-10 py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 font-mono">
      {/* 1. INPUT STATE */}
      {viewState === "input" && (
        <div className="space-y-8">
          <div className="text-center space-y-2 border-b border-zinc-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400">
              <Zap className="h-3.5 w-3.5" />
              <span>TASK ANALYSIS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-zinc-100">
              What actually deserves your time?
            </h1>
            <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto">
              Paste your tasks, plans, or to-do list. ANTI-TODO separates meaningful work from work that only looks productive.
            </p>
          </div>

          <TaskInput onAnalyze={handleStartAnalysis} isLoading={false} />
        </div>
      )}

      {/* 2. LOADING STATE */}
      {viewState === "loading" && (
        <div className="py-8">
          <AnalysisLoader onComplete={handleLoaderComplete} />
        </div>
      )}

      {/* 3. IN-PAGE RESULTS STATE */}
      {viewState === "result" && data && (
        <div className="space-y-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Analyze Another Set</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Result link copied to clipboard!");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:border-zinc-700 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Results Summary Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                {data.projectType}
              </span>
              <span>• {data.project}</span>
            </div>

            <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
              YOUR WORKLOAD
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-100 font-sans">
              Not everything needs to be done.
            </h1>
          </div>

          {/* Summary Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                YOUR ANALYSIS
              </div>
              <div className="text-2xl font-bold text-zinc-100 mt-1">{data.totalTasks} tasks</div>
              <div className="text-xs text-zinc-400 font-sans">
                <span className="text-emerald-400 font-bold font-mono">{highValueCount} worth doing</span> •{" "}
                <span className="text-amber-400 font-bold font-mono">{laterCount} do later</span> •{" "}
                <span className="text-rose-400 font-bold font-mono">{lowValueCount} don't waste time</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-b from-[#16161a] to-[#121215] border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.08)] sm:col-span-2 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">
                <span>Estimated Time Recovered</span>
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono tracking-tight">
                {hoursSaved}h {minsSaved}m
              </div>
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-widest pt-1 font-mono">
                YOU DIDN'T WASTE THIS TIME.
              </div>
            </div>
          </div>

          {/* Brutal mode toggle switch */}
          <BrutalModeToggle value={brutalMode} onChange={setBrutalMode} />

          {/* Priority Categorization Sections */}
          <PrioritySection
            tasks={data.tasks}
            brutalMode={brutalMode}
            onIgnoreTask={handleIgnoreTask}
            onDoLaterTask={handleDoLaterTask}
            onDoNowTask={handleDoNowTask}
            onWhyIgnoreClick={setSelectedWhyTask}
            onRestoreTask={handleRestoreTask}
          />

          {/* THE VERDICT & YOUR NEXT 3 MOVES */}
          <SummaryCard
            verdictSummary={data.verdictSummary}
            nextMoves={data.nextMoves}
            brutalMode={brutalMode}
          />

          {/* Bottom Reset CTA */}
          <div className="pt-6 border-t border-zinc-800 text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-cyan-400 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>[ ← Analyze Another Set ]</span>
            </button>
          </div>

          {/* Expandable Why Ignore Modal */}
          <WhyIgnoreModal
            task={selectedWhyTask}
            brutalMode={brutalMode}
            onClose={() => setSelectedWhyTask(null)}
            onConfirmIgnore={handleIgnoreTask}
          />
        </div>
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-zinc-500 font-mono">Loading workspace...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
