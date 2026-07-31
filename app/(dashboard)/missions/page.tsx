import { getMissions } from "@/lib/queries";
import { PageHeader, Card, Input, Button, Progress, EmptyState } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { createMission } from "./actions";
import { Target, Plus, Trash2 } from "lucide-react";
import { MissionActions } from "./mission-actions";

export default async function MissionsPage() {
  const missions = await getMissions();

  return (
    <div>
      <PageHeader
        title="Mission Center"
        subtitle="Strategic goals and their progress"
        icon={<Target className="h-5 w-5" />}
      />

      {/* New mission */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4 text-accent" /> New Mission
        </h3>
        <form action={createMission} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <Input
            name="title"
            placeholder="Mission title"
            required
            className="md:col-span-4"
          />
          <Input
            name="description"
            placeholder="Short description"
            className="md:col-span-5"
          />
          <select
            name="status"
            defaultValue="planning"
            className="md:col-span-2 rounded-lg bg-black/30 border border-border-soft px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/60"
          >
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          <Button type="submit" variant="primary" className="md:col-span-1">
            Add
          </Button>
        </form>
      </Card>

      {/* List */}
      {missions.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Target className="h-8 w-8" />}
            title="No missions yet"
            hint="Define your first strategic goal above."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {missions.map((m) => (
            <Card key={m.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm">{m.title}</h3>
                  {m.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">
                      {m.description}
                    </p>
                  )}
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="flex items-center gap-3">
                <Progress value={m.progress} />
                <span className="text-xs font-semibold tabular-nums w-10 text-right">
                  {m.progress}%
                </span>
              </div>
              <MissionActions
                id={m.id}
                progress={m.progress}
                status={m.status}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
