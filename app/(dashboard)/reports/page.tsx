import { getDashboardStats, getRecentLogs, getMissions, getContentDrafts } from "@/lib/queries";
import { PageHeader, Card, Stat, Badge } from "@/components/ui";
import { BarChart3, Download, FileText } from "lucide-react";
import { ExportButton } from "./export";

export default async function ReportsPage() {
  const [stats, logs, missions, drafts] = await Promise.all([
    getDashboardStats(),
    getRecentLogs(200),
    getMissions(),
    getContentDrafts(),
  ]);

  const report = {
    generated: new Date().toISOString(),
    stats,
    missions: missions.map((m) => ({ title: m.title, status: m.status, progress: m.progress })),
    content: drafts.map((d) => ({ title: d.title, status: d.status })),
    recentLogs: logs.slice(0, 50).map((l) => ({ agent: l.agent, action: l.action, level: l.level, at: l.created_at })),
  };

  return (
    <div>
      <PageHeader
        title="System Reports"
        subtitle="Aggregate snapshot · exportable"
        icon={<BarChart3 className="h-5 w-5" />}
        action={<ExportButton report={report} />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Agents" value={`${stats.agentsRunning}/${stats.agentsTotal}`} tone="green" />
        <Stat label="Missions" value={stats.missionsTotal} tone="blue" />
        <Stat label="Tasks done" value={stats.tasksCompleted} />
        <Stat label="Memories" value={stats.memories} tone="amber" />
        <Stat label="Tasks pending" value={stats.tasksPending} />
        <Stat label="Tasks failed" value={stats.tasksFailed} tone={stats.tasksFailed ? "red" : "green"} />
        <Stat label="Opportunities" value={stats.opportunitiesNew} tone="blue" />
        <Stat label="Approvals" value={stats.approvalsPending} tone="amber" />
      </div>

      <Card>
        <h3 className="text-sm font-semibold mb-3">Mission Summary</h3>
        {missions.length === 0 ? (
          <p className="text-xs text-text-muted">No missions.</p>
        ) : (
          <div className="space-y-2">
            {missions.map((m) => (
              <div key={m.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-border-soft/50 last:border-0">
                <span className="flex-1 truncate">{m.title}</span>
                <Badge tone="neutral">{m.status}</Badge>
                <span className="text-xs tabular-nums w-10 text-right">{m.progress}%</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
