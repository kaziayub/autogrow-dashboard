"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { LogRow } from "@/lib/types";

const LEVEL_COLOR: Record<string, string> = {
  info: "text-accent-2",
  warn: "text-warn",
  error: "text-danger",
};

export function LogsStream({ initialLogs }: { initialLogs: LogRow[] }) {
  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    const sb = supabaseBrowser();
    const channel = sb
      .channel("logs-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "logs" },
        (payload) => {
          setLogs((prev) => [payload.new as LogRow, ...prev].slice(0, 100));
        }
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, []);

  return (
    <div className="font-mono text-[11px] max-h-[55vh] overflow-y-auto p-3 space-y-1">
      {logs.map((l) => (
        <div key={l.id} className="flex items-start gap-2 py-0.5 hover:bg-white/5 px-1 rounded">
          <span className="text-text-muted/50 shrink-0">
            {new Date(l.created_at).toLocaleTimeString()}
          </span>
          <Badge tone={l.level === "error" ? "red" : l.level === "warn" ? "amber" : "blue"} className="shrink-0">
            {l.agent}
          </Badge>
          <span className={`${LEVEL_COLOR[l.level]} flex-1 break-all`}>{l.action}</span>
        </div>
      ))}
      {logs.length === 0 && <div className="text-text-muted py-8 text-center">No logs.</div>}
    </div>
  );
}
