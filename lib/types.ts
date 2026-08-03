// Hand-written DB row types — matches supabase/schema.sql.
export type AgentControl = {
  id: string;
  agent_name: string;
  status: "running" | "idle" | "error";
  current_task: string | null;
  last_run: string | null;
  next_run: string | null;
  metrics: Record<string, unknown>;
  updated_at: string;
};

export type Mission = {
  id: string;
  title: string;
  description: string | null;
  status: "planning" | "in_progress" | "completed" | "paused" | "active";
  progress: number;
  agent_name?: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  mission_id: string | null;
  agent_name: string;
  title: string;
  status: "pending" | "running" | "waiting_approval" | "completed" | "failed";
  priority: "low" | "medium" | "high";
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Memory = {
  id: string;
  title: string;
  category: string;
  importance: number;
  content: string;
  usage_count: number;
  created_at: string;
};

export type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  impact: "high" | "medium" | "low";
  status: "new" | "accepted" | "rejected";
  payload: Record<string, unknown>;
  created_at: string;
};

export type Approval = {
  id: string;
  title: string;
  description: string | null;
  action_type: string;
  status: "pending" | "approved" | "rejected";
  payload: Record<string, unknown>;
  created_at: string;
};

export type SchedulerJob = {
  id: string;
  job_name: string;
  job_type: "system" | "business" | "user";
  cron_expression: string;
  last_run: string | null;
  next_run: string | null;
  status: string;
  created_at: string;
};

export type SeoAudit = {
  id: string;
  url: string;
  score: number;
  title: string | null;
  meta_description: string | null;
  h1_count: number | null;
  images_without_alt: number | null;
  broken_links: string[];
  created_at: string;
};

export type ContentDraft = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "pr_created" | "published";
  github_pr_url: string | null;
  created_at: string;
};

export type ResearchReport = {
  id: string;
  topic: string;
  summary: string;
  key_findings: string[];
  sources: string[];
  created_at: string;
};

export type LogRow = {
  id: string;
  agent: string;
  action: string;
  level: "info" | "warn" | "error";
  details: Record<string, unknown>;
  created_at: string;
};

export type AiNewsItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  source_url?: string | null;
  created_at: string;
};

export const TABLES = {
  agentControl: "agent_control",
  missions: "missions",
  tasks: "tasks",
  memory: "memory",
  opportunities: "opportunities",
  approvals: "approvals",
  scheduler: "scheduler",
  seoAudits: "seo_audits",
  contentDrafts: "content_drafts",
  researchReports: "research_reports",
  logs: "logs",
  aiNews: "ai_news",
} as const;

