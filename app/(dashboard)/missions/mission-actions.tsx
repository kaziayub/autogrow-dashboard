"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { updateMissionProgress, deleteMission } from "./actions";
import { ChevronUp, Trash2 } from "lucide-react";

export function MissionActions({
  id,
  progress,
  status,
}: {
  id: string;
  progress: number;
  status: string;
}) {
  const [pending, start] = useTransition();
  const [showCtrl, setShowCtrl] = useState(false);

  return (
    <div className="flex items-center justify-between pt-1 border-t border-border-soft/50">
      <button
        onClick={() => setShowCtrl((v) => !v)}
        className="text-xs text-text-muted hover:text-text"
      >
        {showCtrl ? "Hide" : "Manage"}
      </button>
      {showCtrl && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={pending || progress >= 100}
            onClick={() =>
              start(() =>
                updateMissionProgress(
                  id,
                  Math.min(100, progress + 10),
                  progress + 10 >= 100 ? "completed" : "in_progress"
                )
              )
            }
          >
            <ChevronUp className="h-3.5 w-3.5" /> +10%
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={pending}
            onClick={() => start(() => deleteMission(id))}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
