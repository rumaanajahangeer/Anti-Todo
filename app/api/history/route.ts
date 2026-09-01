import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DashboardMetrics } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const single = await db.analysis.findUnique({
        where: { id },
        include: { tasks: true },
      });

      if (!single) {
        return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
      }

      const formatted = {
        ...single,
        nextMoves: JSON.parse(single.nextMoves || "[]"),
        tasks: single.tasks.map((t) => ({
          ...t,
          dependencyUnblocked: JSON.parse(t.dependencyUnblocked || "[]"),
        })),
        createdAt: single.createdAt.toISOString(),
      };

      return NextResponse.json(formatted);
    }

    // Fetch all history and dashboard metrics
    const analyses = await db.analysis.findMany({
      orderBy: { createdAt: "desc" },
      include: { tasks: true },
    });

    let totalWorkEliminatedMinutes = 0;
    let tasksIgnoredCount = 0;
    let tasksCompletedCount = 0;
    let totalTasksAnalyzed = 0;

    const historyList = analyses.map((a) => {
      totalWorkEliminatedMinutes += a.estimatedTimeSavedMinutes;
      totalTasksAnalyzed += a.totalTasks;

      a.tasks.forEach((t) => {
        if (t.isIgnored) tasksIgnoredCount++;
        if (t.isCompleted) tasksCompletedCount++;
      });

      return {
        id: a.id,
        project: a.project,
        projectType: a.projectType,
        totalTasks: a.totalTasks,
        highValueCount: a.highValueCount,
        lowValueCount: a.lowValueCount,
        estimatedTimeSavedMinutes: a.estimatedTimeSavedMinutes,
        createdAt: a.createdAt.toISOString(),
      };
    });

    const averageEliminationRate =
      totalTasksAnalyzed > 0
        ? Math.round((historyList.reduce((acc, item) => acc + item.lowValueCount, 0) / totalTasksAnalyzed) * 100)
        : 0;

    const metrics: DashboardMetrics = {
      totalWorkEliminatedMinutes,
      tasksIgnoredCount,
      tasksCompletedCount,
      totalAnalysesCount: historyList.length,
      averageEliminationRate,
      recentAnalyses: historyList,
    };

    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error("API /api/history error:", error);
    return NextResponse.json({ recentAnalyses: [], totalWorkEliminatedMinutes: 0 }, { status: 200 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await db.analysis.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
