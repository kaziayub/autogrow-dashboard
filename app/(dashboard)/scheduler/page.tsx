import { getSchedulerJobs } from "@/lib/queries";
import { PageHeader, Card, EmptyState, Badge } from "@/components/ui";
import { CalendarClock, Server, Briefcase, User } from "lucide-react";

const TYPE_META: Record<string, { icon: typeof Server; tone: "blue" | "green" | "violet" }> = {
  system: { icon: Server, tone: "blue" },
  business: { icon: Briefcase, tone: "green" },
  user: { icon: User, tone: "violet" },
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default async function SchedulerPage() {
  const jobs = await getSchedulerJobs();
  const byType = {
    system: jobs.filter((j) => j.job_type === "system"),
    business: jobs.filter((j) => j.job_type === "business"),
    user: jobs.filter((j) => j.job_type === "user"),
  };

  return (
    <div>
      <PageHeader
        title="Automation Scheduler"
        subtitle="Cron jobs across system, business & user categories"
        icon={<CalendarClock className="h-5 w-5" />}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(["system", "business", "user"] as const).map((type) => {
          const meta = TYPE_META[type];
          const Icon = meta.icon;
          return (
            <Card key={type}>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold capitalize">{type} Jobs</h3>
                <Badge tone={meta.tone} className="ml-auto">{byType[type].length}</Badge>
              </div>
              <div className="space-y-3">
                {byType[type].map((j) => (
                  <div key={j.id} className="rounded-lg bg-black/20 border border-border-soft p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium">{j.job_name}</span>
                      <Badge tone={j.status === "active" ? "green" : "neutral"}>{j.status}</Badge>
                    </div>
                    <code className="text-[11px] text-accent-2 font-mono">{j.cron_expression}</code>
                    <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] text-text-muted">
                      <span>Last: {fmt(j.last_run)}</span>
                      <span className="text-right">Next: {fmt(j.next_run)}</span>
                    </div>
                  </div>
                ))}
                {byType[type].length === 0 && (
                  <EmptyState icon={<CalendarClock className="h-6 w-6" />} title="No jobs" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
