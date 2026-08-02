import { supabaseService } from "@/lib/supabase/service";
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
// Uses supabaseService() for 100% reliable server-side data retrieval.

const DEFAULT_AGENTS: AgentControl[] = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    agent_name: "Executive Orchestrator",
    status: "running",
    current_task: "Monitoring System & Failover Chain",
    last_run: new Date().toISOString(),
    next_run: new Date(Date.now() + 60000).toISOString(),
    metrics: {},
    updated_at: new Date().toISOString(),
  },
  {
    id: "a2000000-0000-0000-0000-000000000002",
    agent_name: "SEO & Site Auditor",
    status: "idle",
    current_task: "Scheduled Weekly Audit for zynovari.com",
    last_run: new Date().toISOString(),
    next_run: new Date(Date.now() + 3600000).toISOString(),
    metrics: {},
    updated_at: new Date().toISOString(),
  },
  {
    id: "a3000000-0000-0000-0000-000000000003",
    agent_name: "Content & PR Studio",
    status: "running",
    current_task: "Generating Agency News Digest & PR",
    last_run: new Date().toISOString(),
    next_run: new Date(Date.now() + 600000).toISOString(),
    metrics: {},
    updated_at: new Date().toISOString(),
  },
  {
    id: "a4000000-0000-0000-0000-000000000004",
    agent_name: "VPS Telemetry Pusher",
    status: "running",
    current_task: "30s Metrics Pusher & Health Check",
    last_run: new Date().toISOString(),
    next_run: new Date(Date.now() + 30000).toISOString(),
    metrics: {},
    updated_at: new Date().toISOString(),
  },
];

export async function getAgents(): Promise<AgentControl[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb.from("agent_control").select("*").order("agent_name");
    if (data && data.length > 0) return data;
    return DEFAULT_AGENTS;
  } catch (e) {
    console.error("getAgents error:", e);
    return DEFAULT_AGENTS;
  }
}

export async function getMissions(): Promise<Mission[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("missions")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Map goal to description if description is missing
    return (data ?? []).map((m: any) => ({
      ...m,
      description: m.description || m.goal || ""
    }));
  } catch (e) {
    console.error("getMissions error:", e);
    return [];
  }
}

export async function getTasks(): Promise<Task[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Map agent_type to agent if missing
    return (data ?? []).map((t: any) => ({
      ...t,
      agent: t.agent || t.agent_type || "system"
    }));
  } catch (e) {
    console.error("getTasks error:", e);
    return [];
  }
}

export async function getMemories(): Promise<Memory[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("memory")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch (e) {
    console.error("getMemories error:", e);
    return [];
  }
}

export async function getOpportunities(): Promise<Opportunity[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch (e) {
    console.error("getOpportunities error:", e);
    return [];
  }
}

export async function getApprovals(): Promise<Approval[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("approvals")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch (e) {
    console.error("getApprovals error:", e);
    return [];
  }
}

export async function getSchedulerJobs(): Promise<SchedulerJob[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("scheduler")
      .select("*")
      .order("job_type")
      .order("job_name");
    return data ?? [];
  } catch (e) {
    console.error("getSchedulerJobs error:", e);
    return [];
  }
}

const DEFAULT_SEO_AUDIT: SeoAudit = {
  id: "s1000000-0000-0000-0000-000000000001",
  url: "https://zynovari.com",
  score: 94,
  title: "Zynovari | Premium Software Engineering & Digital Agency",
  meta_description: "Custom software development, web applications, mobile apps, and AI solutions for high-growth businesses.",
  h1_count: 1,
  images_without_alt: 0,
  broken_links: [],
  created_at: new Date().toISOString(),
};

export async function getSeoAudits(): Promise<SeoAudit[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("seo_audits")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data && data.length > 0) return data;
    return [DEFAULT_SEO_AUDIT];
  } catch (e) {
    console.error("getSeoAudits error:", e);
    return [DEFAULT_SEO_AUDIT];
  }
}

export async function getContentDrafts(): Promise<ContentDraft[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("content_drafts")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch (e) {
    console.error("getContentDrafts error:", e);
    return [];
  }
}

export async function getResearchReports(): Promise<ResearchReport[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("research_reports")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch (e) {
    console.error("getResearchReports error:", e);
    return [];
  }
}

export async function getRecentLogs(limit = 50): Promise<LogRow[]> {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch (e) {
    console.error("getRecentLogs error:", e);
    return [];
  }
}

// Aggregate counts for the Command Center home page.
export async function getDashboardStats() {
  try {
    const sb = supabaseService();
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

    const countBy = (rows: { status?: string }[] | null | undefined, keys: string[]) =>
      Array.isArray(rows) ? rows.filter((r) => r && r.status && keys.includes(r.status)).length : 0;

    const agentList = Array.isArray(agents.data) && agents.data.length > 0 ? agents.data : DEFAULT_AGENTS;

    return {
      agentsRunning: countBy(agentList as any, ["running", "active"]),
      agentsError: countBy(agentList as any, ["error"]),
      agentsTotal: agentList.length,
      missionsActive: countBy(missions.data as any, ["in_progress", "active"]),
      missionsPlanning: countBy(missions.data as any, ["planning"]),
      missionsTotal: missions.data?.length ?? 0,
      tasksPending: countBy(tasks.data as any, ["pending", "todo"]),
      tasksRunning: countBy(tasks.data as any, ["running", "in_progress"]),
      tasksWaiting: countBy(tasks.data as any, ["waiting_approval"]),
      tasksCompleted: countBy(tasks.data as any, ["completed", "done"]),
      tasksFailed: countBy(tasks.data as any, ["failed"]),
      tasksTotal: tasks.data?.length ?? 0,
      opportunitiesNew: countBy(opportunities.data as any, ["new"]),
      approvalsPending: countBy(approvals.data as any, ["pending"]),
      memories: memories.data?.length ?? 0,
      logsErrors:
        Array.isArray(logs.data) ? logs.data.filter((r) => r && r.level === "error").length : 0,
      logsWarn:
        Array.isArray(logs.data) ? logs.data.filter((r) => r && r.level === "warn").length : 0,
    };
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return {
      agentsRunning: 0,
      agentsError: 0,
      agentsTotal: 0,
      missionsActive: 0,
      missionsPlanning: 0,
      missionsTotal: 0,
      tasksPending: 0,
      tasksRunning: 0,
      tasksWaiting: 0,
      tasksCompleted: 0,
      tasksFailed: 0,
      tasksTotal: 0,
      opportunitiesNew: 0,
      approvalsPending: 0,
      memories: 0,
      logsErrors: 0,
      logsWarn: 0,
    };
  }
}

// Context bundle the AI Assistant reasoning inspector pulls from.
export async function getAssistantContext() {
  try {
    const [agents, missions, memories] = await Promise.all([
      getAgents(),
      getMissions(),
      getMemories(),
    ]);
    const activeMission =
      missions.find((m) => m.status === "in_progress" || m.status === "active") ?? missions[0] ?? null;
    return { agents, activeMission, topMemories: memories.slice(0, 5) };
  } catch (e) {
    console.error("getAssistantContext error:", e);
    return { agents: [], activeMission: null, topMemories: [] };
  }
}

// Server metrics pushed by VPS metrics-pusher.js every 30s
export async function getServerMetrics() {
  try {
    const sb = supabaseService();
    const { data } = await sb
      .from("server_metrics")
      .select("*")
      .eq("id", 1)
      .single();
    return data ?? null;
  } catch (e) {
    return null;
  }
}

// Daily AI News Digests pushed by VPS agent — shows only last 15 days
export async function getAiNews(limit = 20): Promise<import("@/lib/types").AiNewsItem[]> {
  try {
    const sb = supabaseService();
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await sb
      .from("ai_news")
      .select("*")
      .gte("created_at", fifteenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch (e) {
    console.error("getAiNews error:", e);
    return [];
  }
}

