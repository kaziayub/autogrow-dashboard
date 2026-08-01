"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { updateMissionProgress, deleteMission, runMissionAction } from "./actions";
import { ChevronUp, Trash2, Play } from "lucide-react";

export function MissionActions({
  id,
  title,
  progress,
  status,
}: {
  id: string;
  title: string;
  progress: number;
  status: string;
}) {
  const [pending, start] = useTransition();
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    start(async () => {
      await runMissionAction(id, title);
      setTimeout(() => setRunning(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-between pt-2 border-t border-border-soft/50 gap-2">
      <Button
        size="sm"
        variant="primary"
        disabled={pending || running}
        onClick={handleRun}
        className="text-xs flex items-center gap-1.5"
      >
        <Play className="h-3 w-3 fill-current" />
        {running ? "Running Agent..." : "Run Mission"}
      </Button>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="ghost"
          disabled={pending || progress >= 100}
          onClick={() =>
            start(() =>
              updateMissionProgress(
                id,
                Math.min(100, progress + 10),
                progress + 10 >= 100 ? "completed" : "active"
              )
            )
          }
          className="text-xs"
        >
          <ChevronUp className="h-3.5 w-3.5" /> +10%
        </Button>

        <Button
          size="sm"
          variant="danger"
          disabled={pending}
          onClick={() => start(() => deleteMission(id))}
          className="text-xs"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
