import { NextResponse } from "next/server";
import { analyzeTasks } from "@/lib/ai";
import { db } from "@/lib/db";
import { AnalyzePayload } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: AnalyzePayload = await req.json();

    if (!body.project || !body.tasks || !Array.isArray(body.tasks) || body.tasks.length === 0) {
      return NextResponse.json(
        { error: "Project name and at least one task are required." },
        { status: 400 }
      );
    }

    // Filter out empty lines
    const cleanedTasks = body.tasks.map((t) => t.trim()).filter((t) => t.length > 0);

    if (cleanedTasks.length === 0) {
      return NextResponse.json(
        { error: "Please provide valid task items." },
        { status: 400 }
      );
    }

    const payload: AnalyzePayload = {
      project: body.project,
      projectType: body.projectType || "Software",
      context: body.context || "",
      tasks: cleanedTasks,
      brutalMode: !!body.brutalMode,
    };

    const analysisResult = await analyzeTasks(payload);

    // Save to Database asynchronously / silently
    try {
      await db.analysis.create({
        data: {
          id: analysisResult.id,
          project: analysisResult.project,
          projectType: analysisResult.projectType,
          context: analysisResult.context || "",
          totalTasks: analysisResult.totalTasks,
          highValueCount: analysisResult.highValueCount,
          lowValueCount: analysisResult.lowValueCount,
          optionalCount: analysisResult.optionalCount,
          estimatedTimeSavedMinutes: analysisResult.estimatedTimeSavedMinutes,
          brutalMode: analysisResult.brutalMode,
          verdictSummary: analysisResult.verdictSummary,
          nextMoves: JSON.stringify(analysisResult.nextMoves),
          tasks: {
            create: analysisResult.tasks.map((t) => ({
              id: t.id,
              title: t.title,
              priority: t.priority,
              impact: t.impact,
              urgency: t.urgency,
              effort: t.effort,
              category: t.category,
              reason: t.reason,
              brutalReason: t.brutalReason,
              recommendation: t.recommendation,
              dependencyUnblocked: JSON.stringify(t.dependencyUnblocked || []),
              isIgnored: false,
              isCompleted: false,
            })),
          },
        },
      });
    } catch (dbErr) {
      console.warn("Could not save analysis to DB (falling back to memory):", dbErr);
    }

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze tasks." },
      { status: 500 }
    );
  }
}
