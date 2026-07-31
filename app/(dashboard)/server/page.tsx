import { getRecentLogs } from "@/lib/queries";
import { PageHeader, Card, Badge, Stat } from "@/components/ui";
import { Server, Cpu, HardDrive, MemoryStick, AlertTriangle } from "lucide-react";
import { LogsStream } from "./logs-stream";

export default async function ServerPage() {
  const logs = await getRecentLogs(60);
  const errors = logs.filter((l) => l.level === "error").length;
  const warns = logs.filter((l) => l.level === "warn").length;

  return (
    <div>
      <PageHeader
        title="Server Monitor"
        subtitle="VPS health & live log stream"
        icon={<Server className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* ponytail: real metrics come from the VPS engine. Stubbed until connected. */}
        <Stat label="CPU" value="—" icon={<Cpu className="h-4 w-4" />} hint="engine offline" />
        <Stat label="RAM" value="—" icon={<MemoryStick className="h-4 w-4" />} hint="engine offline" />
        <Stat label="Disk" value="—" icon={<HardDrive className="h-4 w-4" />} hint="engine offline" />
        <Stat label="Issues (60)" value={errors + warns} tone={errors ? "red" : warns ? "amber" : "green"} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="glass border border-warn/20 bg-warn/5 rounded-xl px-4 py-3 mb-4 text-xs text-warn flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        VPS engine not connected. Set <code className="font-mono">VPS_WEBHOOK_URL</code> + deploy the PM2 worker to stream live CPU/RAM/Disk.
      </div>

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
