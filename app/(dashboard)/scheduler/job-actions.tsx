"use client";

import { useState } from "react";
import { toggleJob, deleteJob } from "./actions";
import { Pause, Play, Trash2 } from "lucide-react";

export function JobActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleJob(id, status);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this scheduled job?")) return;
    setLoading(true);
    await deleteJob(id);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border-soft/50">
      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent transition-colors disabled:opacity-50"
      >
        {status === "active" ? (
          <>
            <Pause className="h-3 w-3 text-warn" /> Pause
          </>
        ) : (
          <>
            <Play className="h-3 w-3 text-ok" /> Activate
          </>
        )}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="flex items-center gap-1 text-[10px] text-text-muted hover:text-danger transition-colors ml-auto disabled:opacity-50"
      >
        <Trash2 className="h-3 w-3" /> Delete
      </button>
    </div>
  );
}
