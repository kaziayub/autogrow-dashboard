import { supabaseServer } from "@/lib/supabase/server";
import type {
  AgentControl,
  Approval,
  ContentDraft,
  LogRow,
  Memory,
  Mission,
  Opportunity,
  ResearchReport,
  SchedulerJob,
  SeoAudit,
  Task,
} from "@/lib/types";

// All server-side data access in one place. Server components call these.
// Client realtime subscriptions live in components/realtime.tsx + logs-stream.tsx.

export async function getAgents(): Promise<AgentControl[]> {
  const sb = await supabaseServer();
  const { data } = await sb.from("agent_control").select("*").order("agent_name");
  return data ?? [];
}

export async function getMissions(): Promise<Mission[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("missions")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getTasks(): Promise<Task[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getMemories(): Promise<Memory[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("memory")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getApprovals(): Promise<Approval[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("approvals")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getSchedulerJobs(): Promise<SchedulerJob[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("scheduler")
    .select("*")
    .order("job_type")
    .order("job_name");
  return data ?? [];
}

export async function getSeoAudits(): Promise<SeoAudit[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("seo_audits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function getContentDrafts(): Promise<ContentDraft[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("content_drafts")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getResearchReports(): Promise<ResearchReport[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("research_reports")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getRecentLogs(limit = 50): Promise<LogRow[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// Aggregate counts for the Command Center home page.
export async function getDashboardStats() {
  const sb = await supabaseServer();
  const [agents, missions, tasks, opportunities, approvals, memories, logs] =
    await Promise.all([
      sb.from("agent_control").select("status"),
      sb.from("missions").select("status, progress"),
      sb.from("tasks").select("status"),
      sb.from("opportunities").select("status"),
      sb.from("approvals").select("status"),
      sb.from("memory").select("id"),
      sb.from("logs").select("level").limit(200),
    ]);

  const countBy = (rows: { status?: string }[] | null, key: string) =>
    rows?.filter((r) => r.status === key).length ?? 0;

  return {
    agentsRunning: countBy(agents.data as { status: string }[], "running"),
    agentsError: countBy(agents.data as { status: string }[], "error"),
    agentsTotal: agents.data?.length ?? 0,
    missionsActive: countBy(missions.data as { status: string }[], "in_progress"),
    missionsPlanning: countBy(missions.data as { status: string }[], "planning"),
    missionsTotal: missions.data?.length ?? 0,
    tasksPending: countBy(tasks.data as { status: string }[], "pending"),
    tasksRunning: countBy(tasks.data as { status: string }[], "running"),
    tasksWaiting: countBy(tasks.data as { status: string }[], "waiting_approval"),
    tasksCompleted: countBy(tasks.data as { status: string }[], "completed"),
    tasksFailed: countBy(tasks.data as { status: string }[], "failed"),
    tasksTotal: tasks.data?.length ?? 0,
    opportunitiesNew: countBy(opportunities.data as { status: string }[], "new"),
    approvalsPending: countBy(approvals.data as { status: string }[], "pending"),
    memories: memories.data?.length ?? 0,
    logsErrors:
      (logs.data as { level: string }[])?.filter((r) => r.level === "error").length ?? 0,
    logsWarn:
      (logs.data as { level: string }[])?.filter((r) => r.level === "warn").length ?? 0,
  };
}

// Context bundle the AI Assistant reasoning inspector pulls from.
export async function getAssistantContext() {
  const [agents, missions, memories] = await Promise.all([
    getAgents(),
    getMissions(),
    getMemories(),
  ]);
  const activeMission =
    missions.find((m) => m.status === "in_progress") ?? missions[0] ?? null;
  return { agents, activeMission, topMemories: memories.slice(0, 5) };
}
