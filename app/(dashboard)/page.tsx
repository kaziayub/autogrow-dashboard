import { PageHeader, Stat, Card, Badge, Progress } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardStats, getRecentLogs, getAgents } from "@/lib/queries";
import {
  Cpu,
  Target,
  KanbanSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Zap,
  Activity,
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
  const [stats, logs, agents] = await Promise.all([
    getDashboardStats(),
    getRecentLogs(8),
    getAgents(),
  ]);

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
          label="Active Agents"
          value={`${stats.agentsRunning}/${stats.agentsTotal}`}
          icon={<Cpu className="h-4 w-4" />}
          tone={stats.agentsError > 0 ? "red" : "green"}
          hint={stats.agentsError > 0 ? `${stats.agentsError} in error` : "All systems nominal"}
        />
        <Stat
          label="Active Missions"
          value={stats.missionsActive}
          icon={<Target className="h-4 w-4" />}
          tone="blue"
          hint={`${stats.missionsPlanning} in planning`}
        />
        <Stat
          label="Open Tasks"
          value={stats.tasksTotal}
          icon={<KanbanSquare className="h-4 w-4" />}
          tone={stats.tasksFailed > 0 ? "amber" : "neutral"}
          hint={`${stats.tasksWaiting} awaiting approval`}
        />
        <Stat
          label="Alerts"
          value={stats.logsErrors + stats.logsWarn}
          icon={<AlertTriangle className="h-4 w-4" />}
          tone={stats.logsErrors > 0 ? "red" : "neutral"}
          hint={`${stats.logsErrors} errors · ${stats.logsWarn} warnings`}
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

      {/* Recent activity */}
      <Card className="mt-4">
        <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-text-muted">No activity yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 text-sm py-1.5 border-b border-border-soft/50 last:border-0"
              >
                <Badge
                  tone={log.level === "error" ? "red" : log.level === "warn" ? "amber" : "blue"}
                >
                  {log.agent}
                </Badge>
                <span className="text-text-muted font-mono text-xs flex-1 truncate">
                  {log.action}
                </span>
                <span className="text-[10px] text-text-muted/60">
                  {timeAgo(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
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
