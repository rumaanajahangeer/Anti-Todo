"use client";

import { TaskItem } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { ShieldAlert, Clock, Trash2, RotateCcw } from "lucide-react";

interface PrioritySectionProps {
  tasks: TaskItem[];
  brutalMode?: boolean;
  onIgnoreTask: (id: string) => void;
  onDoLaterTask: (id: string) => void;
  onDoNowTask: (id: string) => void;
  onWhyIgnoreClick: (task: TaskItem) => void;
  onRestoreTask?: (id: string) => void;
}

export function PrioritySection({
  tasks,
  brutalMode,
  onIgnoreTask,
  onDoLaterTask,
  onDoNowTask,
  onWhyIgnoreClick,
  onRestoreTask,
}: PrioritySectionProps) {
  const activeTasks = tasks.filter((t) => !t.isIgnored);
  const ignoredTasks = tasks.filter((t) => t.isIgnored);

  const highValue = activeTasks.filter((t) => t.category === "do");
  const lowValue = activeTasks.filter((t) => t.category === "eliminate" || t.category === "defer");
  const laterTasks = activeTasks.filter((t) => t.category === "later");

  return (
    <div className="space-y-10 font-mono">
      {/* HIGH VALUE / DO NOW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-500/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              DO NOW ({highValue.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-400">Tasks that create real progress.</span>
        </div>

        {highValue.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">
            No critical high-value tasks detected.
          </div>
        ) : (
          <div className="space-y-3">
            {highValue.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                brutalMode={brutalMode}
                onIgnore={onIgnoreTask}
                onDoLater={onDoLaterTask}
                onDoNow={onDoNowTask}
                onWhyIgnoreClick={onWhyIgnoreClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* DON'T WASTE YOUR TIME SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-zinc-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              DON'T WASTE YOUR TIME ({lowValue.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-500">Tasks that consume time without creating meaningful value.</span>
        </div>

        {lowValue.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">
            No low-value distraction tasks found.
          </div>
        ) : (
          <div className="space-y-3">
            {lowValue.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                brutalMode={brutalMode}
                onIgnore={onIgnoreTask}
                onDoLater={onDoLaterTask}
                onDoNow={onDoNowTask}
                onWhyIgnoreClick={onWhyIgnoreClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* DO IT LATER SECTION */}
      {laterTasks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400/90">
                DO LATER ({laterTasks.length})
              </h3>
            </div>
            <span className="text-xs text-zinc-500">Tasks that matter, but don&apos;t need your attention yet.</span>
          </div>

          <div className="space-y-3">
            {laterTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                brutalMode={brutalMode}
                onIgnore={onIgnoreTask}
                onDoLater={onDoLaterTask}
                onDoNow={onDoNowTask}
                onWhyIgnoreClick={onWhyIgnoreClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* ELIMINATED WORK SECTION */}
      {ignoredTasks.length > 0 && (
        <section className="p-5 rounded-xl border border-zinc-800 bg-[#0c0c0e] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <Trash2 className="h-4 w-4" />
              <span>ELIMINATED WORK ({ignoredTasks.length})</span>
            </div>
            <span className="text-[11px] text-zinc-500">Work Removed From Queue</span>
          </div>

          <div className="space-y-1.5 pt-2 text-xs">
            {ignoredTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 text-zinc-500 line-through"
              >
                <span className="truncate">{t.title}</span>
                {onRestoreTask && (
                  <button
                    onClick={() => onRestoreTask(t.id)}
                    className="no-underline text-[10px] text-zinc-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
