"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles, Clipboard, Layers, ArrowRight, X } from "lucide-react";
import { PRESET_SCENARIOS, PresetScenario } from "@/lib/presets";
import { BrutalModeToggle } from "./BrutalModeToggle";

interface TaskInputProps {
  onAnalyze: (data: {
    project: string;
    projectType: string;
    context: string;
    tasks: string[];
    brutalMode: boolean;
  }) => void;
  isLoading?: boolean;
}

export function TaskInput({ onAnalyze, isLoading }: TaskInputProps) {
  const [project, setProject] = useState("AI Study Assistant");
  const [projectType, setProjectType] = useState("Software project");
  const [context, setContext] = useState("");
  const [tasks, setTasks] = useState<string[]>([
    "Fix authentication",
    "Rewrite README",
    "Add button animation",
    "Finish API integration",
    "Deploy database",
    "Rename variables",
    "Improve landing page",
    "Add loading animation",
    "Write documentation",
    "Fix broken search",
  ]);

  const [newTaskInput, setNewTaskInput] = useState("");
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [brutalMode, setBrutalMode] = useState(false);

  const projectTypes = [
    "Software project",
    "Startup",
    "College project",
    "Freelance",
    "Personal",
    "Exam preparation",
    "Research",
  ];

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    setTasks([...tasks, newTaskInput.trim()]);
    setNewTaskInput("");
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleBatchPaste = () => {
    if (!pastedText.trim()) return;
    const lines = pastedText
      .split("\n")
      .map((line) => line.replace(/^[\s•\-\*\d\.]+\s*/, "").trim())
      .filter((line) => line.length > 0);

    setTasks([...tasks, ...lines]);
    setPastedText("");
    setPasteModalOpen(false);
  };

  const handleLoadPreset = (preset: PresetScenario) => {
    setProject(preset.project);
    setProjectType(preset.projectType);
    setContext(preset.context);
    setTasks(preset.tasks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tasks.length === 0) return;
    onAnalyze({
      project: project.trim() || "Untitled Project",
      projectType,
      context: context.trim(),
      tasks,
      brutalMode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 font-mono">
      {/* Test Presets bar */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-bold uppercase tracking-wider">
            Quick Test Scenarios
          </span>
          <span className="text-[10px] text-zinc-500">1-Click Load</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-xs text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main AI Workspace Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle glowing accent */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* PROJECT INPUT HEADER */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
            WHAT ARE YOU WORKING ON?
          </label>
          <input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Project name (e.g. AI Study Assistant)"
            className="w-full px-4 py-3 rounded-lg bg-[#09090b] border border-zinc-800 text-base font-bold text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#09090b] border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400 transition-all"
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Context / Goal (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Launching MVP before deadline"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#09090b] border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 font-sans transition-all"
            />
          </div>
        </div>

        <div className="h-px bg-zinc-800/80 my-4" />

        {/* TASK BACKLOG ENTRY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">
                TASK BACKLOG ({tasks.length})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPasteModalOpen(!pasteModalOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs text-zinc-300 transition-colors"
            >
              <Clipboard className="h-3.5 w-3.5 text-cyan-400" />
              <span>Paste Multiple</span>
            </button>
          </div>

          {/* Batch paste container */}
          {pasteModalOpen && (
            <div className="p-4 rounded-xl bg-[#09090b] border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center text-xs text-zinc-300 font-semibold">
                <span>Paste tasks (one task per line):</span>
                <button
                  type="button"
                  onClick={() => setPasteModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`Fix authentication\nRewrite README\nAdd button animation\nFinish API integration\nDeploy database`}
                className="w-full p-3.5 rounded-lg bg-[#121215] border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400 font-sans"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleBatchPaste}
                  className="px-4 py-2 rounded-md bg-cyan-500 text-zinc-950 text-xs font-bold uppercase hover:bg-cyan-400"
                >
                  Import Lines
                </button>
              </div>
            </div>
          )}

          {/* Task Addition Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTask();
                }
              }}
              placeholder="Add task item and press Enter..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#09090b] border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 font-sans transition-all"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="h-4 w-4 text-cyan-400" />
              <span>Add</span>
            </button>
          </div>

          {/* Task Items List */}
          {tasks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl space-y-2 text-zinc-500 text-xs font-sans">
              <div className="font-mono text-zinc-400 uppercase font-bold">NO TASKS ADDED YET</div>
              <p>Type your tasks above or paste a list to get started.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#09090b]/90 border border-zinc-800/90 text-xs text-zinc-200 group hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <span className="text-zinc-600 font-mono text-[11px] font-bold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate font-sans text-sm font-medium text-zinc-200">
                      {task}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(idx)}
                    aria-label={`Remove ${task}`}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors opacity-70 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-zinc-800/80 my-4" />

        {/* Brutal Mode Switch */}
        <BrutalModeToggle value={brutalMode} onChange={setBrutalMode} />
      </div>

      {/* Primary Submit CTA */}
      <button
        type="submit"
        disabled={tasks.length === 0 || isLoading}
        className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <span>[ Analyze Tasks → ]</span>
      </button>
    </form>
  );
}
