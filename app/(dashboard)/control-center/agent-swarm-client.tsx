"use client";

import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import type { AgentControl } from "@/lib/types";
import { Cpu, Play, Loader2, Activity } from "lucide-react";

function timeAgo(iso: string | null) {
  if (!iso) return "never";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function AgentSwarmClient({ agents }: { agents: AgentControl[] }) {
  const [running, setRunning] = useState<string | null>(null);

  async function runNow(agent: string) {
    setRunning(agent);
    try {
      await fetch("/api/trigger-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent }),
      });
    } finally {
      setRunning(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Agent Swarm Control"
        subtitle="Live status of all 6 autonomous sub-agents"
        icon={<Cpu className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((a) => (
          <Card key={a.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{a.agent_name}</h3>
                  <p className="text-[11px] text-text-muted">
                    {(a.metrics?.role as string) ?? "Agent"}
                  </p>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-text-muted mb-0.5">Current task</div>
                <div className="truncate">{a.current_task ?? "Standby"}</div>
              </div>
              <div>
                <div className="text-text-muted mb-0.5">Last run</div>
                <div>{timeAgo(a.last_run)}</div>
              </div>
              <div>
                <div className="text-text-muted mb-0.5">Next run</div>
                <div>{a.next_run ? timeAgo(a.next_run) : "—"}</div>
              </div>
              <div>
                <div className="text-text-muted mb-0.5">Heartbeat</div>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3" />
                  {timeAgo(a.updated_at)}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full"
              disabled={running === a.agent_name}
              onClick={() => runNow(a.agent_name)}
            >
              {running === a.agent_name ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Triggering…
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" /> Run Now
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
