import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalyzePayload, AnalysisResult, TaskItem, PriorityType, TaskCategory } from "./types";

/**
 * Intelligent AI Task Elimination Analyzer
 * Analyzes tasks using Gemini API if key is present,
 * or falls back to an advanced heuristic reasoning engine.
 */
export async function analyzeTasks(payload: AnalyzePayload): Promise<AnalysisResult> {
  const { project, projectType, context = "", tasks, brutalMode = false } = payload;
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (apiKey) {
    try {
      return await analyzeWithGemini(apiKey, payload);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to heuristic engine:", err);
    }
  }

  // Fallback to advanced heuristic analysis engine
  return analyzeWithHeuristicEngine(payload);
}

/**
 * Call Gemini API with structured JSON output requirements
 */
async function analyzeWithGemini(apiKey: string, payload: AnalyzePayload): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
You are the AI engine for "ANTI-TODO" — an aggressive task elimination and prioritization decision tool.
Philosophy: "Prioritization through elimination. Find the work the user should IGNORE."

PROJECT DETAILS:
- Name: ${payload.project}
- Type: ${payload.projectType}
- Context: ${payload.context || "No context provided."}
- Brutal Mode Enabled: ${payload.brutalMode ? "YES (Be blunt, direct, unfiltered, humorous yet truthful)" : "NO (Be sharp, professional, objective)"}

TASKS TO ANALYZE:
${payload.tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}

INSTRUCTIONS:
1. Analyze each task based on:
   - Does it unblock other tasks? (Dependencies)
   - Impact (1-10): How much value does it create?
   - Urgency (1-10): How pressing is it right now?
   - Effort (1-10): How long/hard will it take?
   - Category: "do" (High Value), "defer" or "eliminate" (Low Value / Don't Waste Time), "later" (Do It Later).
   - Priority: "critical", "high", "medium", "low", "optional".
2. Recognize task dependencies (e.g. Authentication unblocks Protected Routes & Deployment).
3. Do NOT classify something as low value just because it sounds cosmetic if it's actually blocking a deadline, but DO aggressively eliminate early micro-optimizations, premature refactoring, README rewrites, variable renaming, and visual polish before core functional APIs work.
4. Output JSON adhering EXACTLY to this schema:

{
  "verdictSummary": "A concise 2-3 sentence AI summary explaining where the user is wasting time and what to focus on.",
  "nextMoves": ["Move 1 (most critical)", "Move 2", "Move 3"],
  "tasks": [
    {
      "title": "Task title",
      "priority": "critical" | "high" | "medium" | "low" | "optional",
      "impact": 1-10,
      "urgency": 1-10,
      "effort": 1-10,
      "category": "do" | "defer" | "eliminate" | "later",
      "reason": "1-2 sentence core reason for classification",
      "brutalReason": "Unfiltered direct explanation of why spending time on this right now is a mistake or essential.",
      "recommendation": "Actionable recommendation",
      "dependencyUnblocked": ["Task it unblocks if any"],
      "estimatedMinutesSaved": number of minutes saved if eliminated/deferred
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text);

  const processedTasks: TaskItem[] = parsed.tasks.map((t: any, index: number) => ({
    id: `task-${Date.now()}-${index}`,
    title: t.title,
    priority: t.priority as PriorityType,
    impact: Math.min(10, Math.max(1, t.impact || 5)),
    urgency: Math.min(10, Math.max(1, t.urgency || 5)),
    effort: Math.min(10, Math.max(1, t.effort || 5)),
    category: (t.category as TaskCategory) || 'do',
    reason: t.reason || "Analyzed by AI.",
    brutalReason: t.brutalReason || t.reason || "Stop wasting time on this.",
    recommendation: t.recommendation || "Do core work first.",
    dependencyUnblocked: t.dependencyUnblocked || [],
    isIgnored: false,
    isCompleted: false,
  }));

  const highValue = processedTasks.filter((t) => t.category === "do");
  const lowValue = processedTasks.filter((t) => t.category === "defer" || t.category === "eliminate");
  const optional = processedTasks.filter((t) => t.category === "later");

  const totalTimeSaved = lowValue.reduce((acc, t) => acc + (t.effort * 30), 0) + optional.reduce((acc, t) => acc + (t.effort * 20), 0);

  return {
    id: `analysis-${Date.now()}`,
    project: payload.project,
    projectType: payload.projectType,
    context: payload.context,
    totalTasks: processedTasks.length,
    highValueCount: highValue.length,
    lowValueCount: lowValue.length,
    optionalCount: optional.length,
    estimatedTimeSavedMinutes: totalTimeSaved,
    brutalMode: !!payload.brutalMode,
    verdictSummary: parsed.verdictSummary || "Focus strictly on high-impact items.",
    nextMoves: parsed.nextMoves || highValue.slice(0, 3).map((t) => t.title),
    tasks: processedTasks,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Intelligent Heuristic Analysis Engine (Runs offline or when no API key is set)
 */
function analyzeWithHeuristicEngine(payload: AnalyzePayload): AnalysisResult {
  const { project, projectType, context = "", tasks, brutalMode = false } = payload;

  const lowKeywords = [
    "readme", "documentation", "doc", "rename", "variable", "refactor", "animation",
    "spinner", "theme", "dark mode", "font", "css", "color", "logo", "icon", "format",
    "clean up", "comment", "lint", "prettify", "button style", "hover effect", "footer link"
  ];

  const highKeywords = [
    "auth", "login", "api", "database", "deploy", "server", "payment", "stripe", "checkout",
    "core", "bug", "crash", "fix", "security", "pipeline", "model", "loader", "webhook",
    "backend", "test suite", "data loss", "migration", "integration"
  ];

  // Dependency mapping check
  const hasAuth = tasks.some(t => /auth|login|signup/i.test(t));
  const hasApi = tasks.some(t => /api|backend|endpoint/i.test(t));
  const hasDb = tasks.some(t => /database|db|migration|prisma|sql/i.test(t));

  const processedTasks: TaskItem[] = tasks.map((taskTitle, idx) => {
    const titleLower = taskTitle.toLowerCase();
    
    let impact = 5;
    let urgency = 5;
    let effort = 4;
    let category: TaskCategory = 'do';
    let priority: PriorityType = 'medium';
    let unblocked: string[] = [];

    // Analyze high impact / core keywords
    const isHigh = highKeywords.some(k => titleLower.includes(k));
    const isLow = lowKeywords.some(k => titleLower.includes(k));

    if (/auth|login|signup/i.test(taskTitle)) {
      impact = 10;
      urgency = 9;
      effort = 6;
      priority = 'critical';
      category = 'do';
      if (hasApi) unblocked.push("API Integration");
      if (tasks.some(t => /deploy/i.test(t))) unblocked.push("Production Deployment");
    } else if (/api|backend|endpoint/i.test(taskTitle)) {
      impact = 9;
      urgency = 9;
      effort = 7;
      priority = 'high';
      category = 'do';
      if (hasDb) unblocked.push("Database Connection");
    } else if (/database|db|deploy|production|server/i.test(taskTitle)) {
      impact = 9;
      urgency = 8;
      effort = 5;
      priority = 'high';
      category = 'do';
    } else if (/bug|fix|crash|security/i.test(taskTitle)) {
      impact = 8;
      urgency = 9;
      effort = 4;
      priority = 'high';
      category = 'do';
    } else if (isLow) {
      if (/readme|doc/i.test(titleLower)) {
        impact = 2;
        urgency = 2;
        effort = 3;
        priority = 'low';
        category = 'eliminate';
      } else if (/animation|spinner|color|font|theme|hover|css/i.test(titleLower)) {
        impact = 2;
        urgency = 1;
        effort = 4;
        priority = 'low';
        category = 'eliminate';
      } else if (/rename|variable|format|lint|prettify/i.test(titleLower)) {
        impact = 1;
        urgency = 1;
        effort = 2;
        priority = 'low';
        category = 'eliminate';
      } else {
        impact = 3;
        urgency = 2;
        effort = 3;
        priority = 'optional';
        category = 'later';
      }
    } else if (isHigh) {
      impact = 8;
      urgency = 7;
      effort = 5;
      priority = 'high';
      category = 'do';
    } else {
      // Default heuristic calculation based on index & wording length
      impact = Math.max(3, 8 - Math.floor(idx * 0.7));
      urgency = Math.max(2, 7 - Math.floor(idx * 0.6));
      effort = Math.floor(3 + (taskTitle.length % 5));
      if (impact >= 6) {
        category = 'do';
        priority = impact >= 8 ? 'high' : 'medium';
      } else if (impact <= 3) {
        category = 'eliminate';
        priority = 'low';
      } else {
        category = 'later';
        priority = 'optional';
      }
    }

    // Generate reasons
    let reason = "";
    let brutalReason = "";
    let recommendation = "";

    if (category === 'do') {
      reason = `${taskTitle} is core functionality directly impacting ${project || 'the project'}.`;
      brutalReason = `This actually moves the needle. Everything else is distraction until this works.`;
      recommendation = "Do this first.";
    } else if (category === 'eliminate' || (category as TaskCategory) === 'defer') {
      reason = `Useful in isolation, but does not currently improve core functionality or unblock other tasks.`;
      brutalReason = brutalMode
        ? `Stop working on this right now. Nobody cares about ${taskTitle.toLowerCase()} while core functionality is incomplete.`
        : `Cosmetic or premature optimization. Focus on high-value tasks first.`;
      recommendation = "Postpone or delete from current sprint.";
    } else {
      reason = `Not urgent right now. Save it for polish phase after launching MVP.`;
      brutalReason = brutalMode
        ? `Do this later. Working on this now is pure procrastination disguised as progress.`
        : `Non-blocking enhancement. Revisit after core release.`;
      recommendation = "Schedule for phase 2.";
    }

    return {
      id: `task-${Date.now()}-${idx}`,
      title: taskTitle,
      priority,
      impact,
      urgency,
      effort,
      category,
      reason,
      brutalReason,
      recommendation,
      dependencyUnblocked: unblocked,
      isIgnored: false,
      isCompleted: false,
    };
  });

  const highValue = processedTasks.filter((t) => t.category === 'do');
  const lowValue = processedTasks.filter((t) => t.category === 'eliminate' || t.category === 'defer');
  const optional = processedTasks.filter((t) => t.category === 'later');

  const totalTimeSaved = lowValue.reduce((acc, t) => acc + (t.effort * 35), 0) + optional.reduce((acc, t) => acc + (t.effort * 20), 0);

  const top3Moves = highValue.slice(0, 3).map(t => t.title);

  let verdictSummary = `You're spending too much effort polishing secondary details before the core system works. Focus on ${top3Moves[0] || 'core tasks'}, ${top3Moves[1] || 'critical integrations'}, and shipping. Everything else can wait.`;
  if (brutalMode) {
    verdictSummary = `Stop procrastinating with micro-edits and animations. Fix ${top3Moves[0] || 'the main core feature'} immediately. The rest of your list is low-impact noise.`;
  }

  return {
    id: `analysis-${Date.now()}`,
    project,
    projectType,
    context,
    totalTasks: processedTasks.length,
    highValueCount: highValue.length,
    lowValueCount: lowValue.length,
    optionalCount: optional.length,
    estimatedTimeSavedMinutes: totalTimeSaved,
    brutalMode: !!brutalMode,
    verdictSummary,
    nextMoves: top3Moves.length > 0 ? top3Moves : ["Execute highest impact task"],
    tasks: processedTasks,
    createdAt: new Date().toISOString(),
  };
}
