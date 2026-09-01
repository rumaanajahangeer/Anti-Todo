export type PriorityType = 'critical' | 'high' | 'medium' | 'low' | 'optional';
export type TaskCategory = 'do' | 'defer' | 'eliminate' | 'later';

export interface TaskItem {
  id: string;
  title: string;
  priority: PriorityType;
  impact: number;      // 1-10
  urgency: number;     // 1-10
  effort: number;      // 1-10
  category: TaskCategory;
  reason: string;
  brutalReason: string;
  recommendation: string;
  dependencyUnblocked?: string[];
  isIgnored?: boolean;
  isCompleted?: boolean;
}

export interface AnalysisResult {
  id: string;
  project: string;
  projectType: string;
  context?: string;
  totalTasks: number;
  highValueCount: number;
  lowValueCount: number;
  optionalCount: number;
  estimatedTimeSavedMinutes: number;
  brutalMode: boolean;
  verdictSummary: string;
  nextMoves: string[];
  tasks: TaskItem[];
  createdAt: string;
}

export interface AnalyzePayload {
  project: string;
  projectType: string;
  context?: string;
  tasks: string[];
  brutalMode?: boolean;
}

export interface DashboardMetrics {
  totalWorkEliminatedMinutes: number;
  tasksIgnoredCount: number;
  tasksCompletedCount: number;
  totalAnalysesCount: number;
  averageEliminationRate: number; // e.g. 64%
  recentAnalyses: {
    id: string;
    project: string;
    projectType: string;
    totalTasks: number;
    highValueCount: number;
    lowValueCount: number;
    estimatedTimeSavedMinutes: number;
    createdAt: string;
  }[];
}
