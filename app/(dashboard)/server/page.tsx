import { getRecentLogs, getServerMetrics } from "@/lib/queries";
import { PageHeader, Card, Badge, Stat } from "@/components/ui";
import { Server, Cpu, HardDrive, MemoryStick, AlertTriangle, CheckCircle2 } from "lucide-react";
import { LogsStream } from "./logs-stream";

export default async function ServerPage() {
  const [logs, metrics] = await Promise.all([
    getRecentLogs(60),
    getServerMetrics(),
  ]);

  const errors = logs.filter((l) => l.level === "error").length;
  const warns = logs.filter((l) => l.level === "warn").length;
  const connected = !!metrics;

  // How fresh is the data? (warn if > 2 min stale)
  const staleSec = metrics?.updated_at
    ? Math.floor((Date.now() - new Date(metrics.updated_at).getTime()) / 1000)
    : null;
  const stale = staleSec !== null && staleSec > 120;

  const cpuText  = metrics ? `${metrics.cpu_percent}%`  : "—";
  const ramUsed  = metrics ? (metrics.ram_used_mb  / 1024).toFixed(1) : null;
  const ramTotal = metrics ? (metrics.ram_total_mb / 1024).toFixed(1) : null;
  const ramText  = ramUsed ? `${ramUsed} / ${ramTotal} GB` : "—";
  const ramHint  = metrics ? `${metrics.ram_percent}% used` : "engine offline";
  const diskText = metrics?.disk_usage ?? "—";
  const diskHint = metrics ? "healthy" : "engine offline";

  return (
    <div>
      <PageHeader
        title="Server Monitor"
        subtitle="VPS health & live log stream"
        icon={<Server className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Stat label="CPU"         value={cpuText}  icon={<Cpu          className="h-4 w-4" />} hint={connected ? "online" : "engine offline"} tone={connected ? "green" : "neutral"} />
        <Stat label="RAM"         value={ramText}  icon={<MemoryStick  className="h-4 w-4" />} hint={ramHint}  tone={connected ? "green" : "neutral"} />
        <Stat label="Disk"        value={diskText} icon={<HardDrive    className="h-4 w-4" />} hint={diskHint} tone={connected && !stale ? "green" : "neutral"} />
        <Stat label="Issues (60)" value={errors + warns} tone={errors ? "red" : warns ? "amber" : "green"} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      {connected && !stale ? (
        <div className="glass border border-ok/20 bg-ok/5 rounded-xl px-4 py-3 mb-4 text-xs text-ok flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              VPS metrics live via Supabase — updated {staleSec}s ago
              {metrics.pm2_status ? ` · PM2 ${metrics.pm2_status}` : ""}
            </span>
          </div>
          <Badge tone="green">🟢 Connected</Badge>
        </div>
      ) : connected && stale ? (
        <div className="glass border border-warn/20 bg-warn/5 rounded-xl px-4 py-3 mb-4 text-xs text-warn flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Metrics stale ({staleSec}s ago) — VPS metrics-pusher may be restarting.
        </div>
      ) : (
        <div className="glass border border-warn/20 bg-warn/5 rounded-xl px-4 py-3 mb-4 text-xs text-warn flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Waiting for first metrics push from VPS... (starting up)
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft">
          <h3 className="text-sm font-semibold">Log Stream</h3>
          <Badge tone="green"><span className="h-1.5 w-1.5 rounded-full bg-ok pulse-dot" />live</Badge>
        </div>
        <LogsStream initialLogs={logs} />
      </Card>
    </div>
  );
}
