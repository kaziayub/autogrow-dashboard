import { getMissions } from "@/lib/queries";
import { PageHeader, Card, Input, Button, Progress, EmptyState } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { createMission } from "./actions";
import { Target, Plus, Bot } from "lucide-react";
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
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-200">
          <Plus className="h-4 w-4 text-emerald-400" /> New Mission
        </h3>
        <form action={createMission} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <Input
            name="title"
            placeholder="Mission title"
            required
            className="md:col-span-3"
          />
          <Input
            name="description"
            placeholder="Short description"
            className="md:col-span-4"
          />
          <select
            name="agent_name"
            defaultValue="Executive"
            className="md:col-span-2 rounded-lg bg-white/[0.04] border border-white/[0.09] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition"
          >
            <option value="Executive">Executive Agent</option>
            <option value="SEO & Site Auditor">SEO & Site Auditor</option>
            <option value="Content Studio">Content Studio</option>
            <option value="Website">Website Crawler</option>
            <option value="Research">Research Agent</option>
            <option value="Scheduler">Scheduler Agent</option>
          </select>
          <select
            name="status"
            defaultValue="planning"
            className="md:col-span-2 rounded-lg bg-white/[0.04] border border-white/[0.09] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition"
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
                  <h3 className="font-semibold text-sm text-slate-100">{m.title}</h3>
                  {m.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {m.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium bg-white/[0.05] text-slate-400 border border-white/[0.07] px-2 py-0.5 rounded-full">
                      <Bot className="h-3 w-3 text-emerald-500" />
                      Agent: {m.agent_name || "Executive"}
                    </span>
                  </div>
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
                title={m.title}
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
