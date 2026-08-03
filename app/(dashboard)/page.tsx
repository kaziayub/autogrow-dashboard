import { PageHeader, Stat, Card, Badge, Progress } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardStats, getRecentLogs, getAgents, getAiNews } from "@/lib/queries";
import {
  Cpu,
  Target,
  KanbanSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Zap,
  Activity,
  Newspaper,
  ExternalLink,
  User,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default async function CommandCenter() {
  const [stats, logs, agents, aiNews] = await Promise.all([
    getDashboardStats(),
    getRecentLogs(8),
    getAgents(),
    getAiNews(5),
  ]);

  const hasSystemError = stats.agentsError > 0 || stats.logsErrors > 0;

  return (
    <div>
      <PageHeader
        title="Command Center"
        subtitle="Real-time overview of your autonomous agency"
        icon={<Activity className="h-5 w-5" />}
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat
          label="ACTIVE AGENTS"
          value={`${stats.agentsRunning}/${stats.agentsTotal}`}
          icon={<User className="h-4.5 w-4.5" />}
          tone={stats.agentsError > 0 ? "red" : "green"}
          hint={stats.agentsError > 0 ? `${stats.agentsError} in error` : "All agents online"}
        />
        <Stat
          label="ACTIVE MISSIONS"
          value={stats.missionsActive}
          icon={<Target className="h-4.5 w-4.5" />}
          tone="blue"
          hint={`${stats.missionsPlanning} in planning`}
        />
        <Stat
          label="OPEN TASKS"
          value={stats.tasksTotal}
          icon={<ClipboardList className="h-4.5 w-4.5" />}
          tone={stats.tasksFailed > 0 ? "amber" : "neutral"}
          hint={`${stats.tasksWaiting} awaiting approval`}
        />
        <Stat
          label="SYSTEM STATUS"
          value={hasSystemError ? "WARNING" : "NOMINAL"}
          icon={<Activity className="h-4.5 w-4.5 animate-pulse" />}
          tone={hasSystemError ? "red" : "green"}
          hint={hasSystemError ? "Error detected in logs" : "All systems normal"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Agent status grid */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Agent Swarm</h3>
            <Link href="/control-center" className="text-xs text-accent hover:underline">
              Manage →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {agents.map((a) => (
              <div
                key={a.id}
                className="rounded-lg bg-black/20 border border-border-soft p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{a.agent_name}</span>
                  <StatusBadge status={a.status} />
                </div>
                <div className="text-[10px] text-text-muted">
                  {a.current_task ?? "Standby"}
                </div>
                <div className="text-[10px] text-text-muted/70 mt-1">
                  {a.last_run ? `last ${timeAgo(a.last_run)}` : "never run"}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Task pipeline */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Task Pipeline</h3>
            <Link href="/tasks" className="text-xs text-accent hover:underline">
              Board →
            </Link>
          </div>
          <div className="space-y-3 text-sm">
            <PipelineRow
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Pending"
              value={stats.tasksPending}
              tone="neutral"
            />
            <PipelineRow
              icon={<Zap className="h-3.5 w-3.5" />}
              label="Running"
              value={stats.tasksRunning}
              tone="green"
            />
            <PipelineRow
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
              label="Waiting approval"
              value={stats.tasksWaiting}
              tone="amber"
            />
            <PipelineRow
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              label="Completed"
              value={stats.tasksCompleted}
              tone="blue"
            />
          </div>
        </Card>
      </div>

      {/* Daily AI News Digest Card */}
      <Card className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold">Daily Agency AI Digest (Auto-Updated at 8:00 AM)</h3>
          </div>
          <Badge tone="blue">Daily 8:00 AM Cron Active</Badge>
        </div>
        {aiNews.length === 0 ? (
          <p className="text-xs text-text-muted">No news digests posted yet. The VPS agent will auto-update every morning at 8:00 AM.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiNews.map((news) => (
              <div key={news.id} className="rounded-lg bg-black/20 border border-border-soft p-3 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-text text-sm truncate">{news.title}</span>
                  <Badge tone="amber">{news.category || "AI Update"}</Badge>
                </div>
                <p className="text-text-muted leading-relaxed mb-2">{news.summary}</p>
                <div className="flex items-center justify-between text-[10px] text-text-muted/60">
                  <span>{timeAgo(news.created_at)}</span>
                  {news.source_url && (
                    <a href={news.source_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline">
                      Source <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent activity terminal */}
      <Card className="mt-6 border border-[#00ff66]/40 bg-black/80 relative overflow-hidden rounded-lg shadow-[0_0_20px_rgba(0,255,102,0.08)]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#00ff66]/20 bg-black/60 px-4 py-2.5 -mx-5 -mt-5 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#00ff66]/80 cyber-glow">
            RECENT ACTIVITY
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Scanlines overlay inside terminal */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-30" />

        {/* Terminal screen */}
        <div className="space-y-2.5 min-h-[220px] max-h-[350px] overflow-y-auto font-mono text-[11px] leading-relaxed text-[#00ff66] custom-scrollbar text-left">
          {/* Initial boot sequence logs to match screenshot */}
          <div className="text-[#00ff66]/40 flex gap-2">
            <span>[00:00:01]</span>
            <span className="text-[#00ff66]/60">[INIT]</span>
            <span>AutoGrow OS boot sequence initiated... success</span>
          </div>
          <div className="text-[#00ff66]/40 flex gap-2">
            <span>[00:00:02]</span>
            <span className="text-[#00ff66]/60">[CORE]</span>
            <span>System kernel loaded. All modules operational.</span>
          </div>

          {/* Database active logs */}
          {logs.map((log) => {
            const date = new Date(log.created_at);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            
            let colorClass = "text-[#00ff66]/80";
            if (log.level === "error") colorClass = "text-red-500 font-bold cyber-glow";
            if (log.level === "warn") colorClass = "text-yellow-500 font-semibold";

            return (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-[#00ff66]/40">[{timeStr}]</span>
                <span className="text-[#00ff66]/60 uppercase">[{log.agent}]</span>
                <span className={colorClass}>{log.action}</span>
                <span className="text-[#00ff66]/30">... success</span>
              </div>
            );
          })}

          {/* Awaiting next command blinking prompt */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#00ff66]/10 text-[#00ff66]">
            <span className="text-[#00ff66]/40">
              [{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}]
            </span>
            <span className="text-[#00ff66]/60">[IDLE]</span>
            <span>
              System is idle. Awaiting next command...
              <span className="cyber-cursor" />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PipelineRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "neutral" | "green" | "amber" | "blue";
}) {
  const colors: Record<string, string> = {
    neutral: "text-text-muted",
    green: "text-ok",
    amber: "text-warn",
    blue: "text-accent-2",
  };
  return (
    <div className="flex items-center justify-between">
      <span className={`flex items-center gap-2 ${colors[tone]}`}>
        {icon}
        <span className="text-text">{label}</span>
      </span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
