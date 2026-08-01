import { getRecentLogs } from "@/lib/queries";
import { PageHeader, Card, Badge, Stat } from "@/components/ui";
import { Server, Cpu, HardDrive, MemoryStick, AlertTriangle, CheckCircle2 } from "lucide-react";
import { LogsStream } from "./logs-stream";

const VPS_HEALTH_URL = process.env.VPS_WEBHOOK_URL
  ? process.env.VPS_WEBHOOK_URL.replace("/api/trigger-agent", "/api/health")
  : "http://63.180.69.67:3005/api/health";

export default async function ServerPage() {
  const logs = await getRecentLogs(60);
  const errors = logs.filter((l) => l.level === "error").length;
  const warns = logs.filter((l) => l.level === "warn").length;

  let metrics: any = null;
  let connected = false;

  try {
    const res = await fetch(VPS_HEALTH_URL, {
      next: { revalidate: 5 },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      metrics = data.metrics || null;
      connected = true;
    }
  } catch (err) {
    connected = false;
  }

  const cpuText = metrics ? `${metrics.cpuUsagePercent}%` : "—";
  const ramText = metrics
    ? `${Math.round(((metrics.totalMemMB - metrics.freeMemMB) / 1024) * 10) / 10} GB / ${(metrics.totalMemMB / 1024).toFixed(1)} GB`
    : "—";
  const ramHint = metrics
    ? `${metrics.memoryUsagePercent}% used (${Math.round((metrics.freeMemMB / 1024) * 10) / 10} GB free)`
    : "engine offline";
  const diskText = metrics ? metrics.diskUsage : "—";
  const diskHint = metrics ? "healthy" : "engine offline";

  return (
    <div>
      <PageHeader
        title="Server Monitor"
        subtitle="VPS health & live log stream"
        icon={<Server className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Stat label="CPU" value={cpuText} icon={<Cpu className="h-4 w-4" />} hint={metrics ? "online" : "engine offline"} tone={metrics ? "green" : "neutral"} />
        <Stat label="RAM" value={ramText} icon={<MemoryStick className="h-4 w-4" />} hint={ramHint} tone={metrics ? "green" : "neutral"} />
        <Stat label="Disk" value={diskText} icon={<HardDrive className="h-4 w-4" />} hint={diskHint} tone={metrics ? "green" : "neutral"} />
        <Stat label="Issues (60)" value={errors + warns} tone={errors ? "red" : warns ? "amber" : "green"} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      {connected ? (
        <div className="glass border border-ok/20 bg-ok/5 rounded-xl px-4 py-3 mb-4 text-xs text-ok flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>AWS VPS Engine (AutoClaw ReAct) connected & streaming live system metrics!</span>
          </div>
          <Badge tone="green">Port 3005 Active</Badge>
        </div>
      ) : (
        <div className="glass border border-warn/20 bg-warn/5 rounded-xl px-4 py-3 mb-4 text-xs text-warn flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          VPS engine connecting... Retrying live metrics endpoint.
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
