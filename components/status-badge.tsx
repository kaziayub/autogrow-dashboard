import { Badge } from "@/components/ui";

const STATUS_TONE: Record<string, "green" | "blue" | "amber" | "red" | "neutral" | "violet"> = {
  // agents
  running: "green",
  idle: "neutral",
  error: "red",
  // missions
  planning: "blue",
  in_progress: "green",
  completed: "violet",
  paused: "amber",
  // tasks
  pending: "neutral",
  waiting_approval: "amber",
  failed: "red",
  // generic
  new: "blue",
  accepted: "green",
  rejected: "red",
  approved: "green",
  active: "green",
  draft: "neutral",
  pr_created: "blue",
  published: "violet",
};

const STATUS_LABEL: Record<string, string> = {
  in_progress: "In Progress",
  waiting_approval: "Waiting Approval",
  pr_created: "PR Created",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? "neutral";
  const label = STATUS_LABEL[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  const dot =
    status === "running" ? (
      <span className="h-1.5 w-1.5 rounded-full pulse-dot"
        style={{ background: '#00ff9d', boxShadow: '0 0 5px rgba(0,255,157,0.8)' }} />
    ) : null;
  return (
    <Badge tone={tone}>
      {dot}
      {label}
    </Badge>
  );
}
