import { getSchedulerJobs } from "@/lib/queries";
import { PageHeader, Card, EmptyState, Badge, Input, Button } from "@/components/ui";
import { CalendarClock, Server, Briefcase, User, Plus } from "lucide-react";
import { createJob } from "./actions";
import { JobActions } from "./job-actions";

const TYPE_META: Record<string, { icon: typeof Server; tone: "blue" | "green" | "violet" }> = {
  system: { icon: Server, tone: "blue" },
  business: { icon: Briefcase, tone: "green" },
  user: { icon: User, tone: "violet" },
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
        subtitle="Manage System, Business & User Cron Jobs directly from website UI"
        icon={<CalendarClock className="h-5 w-5" />}
      />

      {/* Add New Job Form Card */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4 text-accent" /> Add New Automation Schedule
        </h3>
        <form action={createJob} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <Input
            name="job_name"
            placeholder="Schedule title (e.g. Daily Client Follow-up)"
            required
            className="md:col-span-5"
          />
          <select
            name="job_type"
            defaultValue="user"
            className="md:col-span-3 rounded-lg bg-black/30 border border-border-soft px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/60"
          >
            <option value="user">User Job (Personal)</option>
            <option value="business">Business Job (Agency / SEO)</option>
            <option value="system">System Job (VPS / DB Maintenance)</option>
          </select>
          <Input
            name="cron_expression"
            placeholder="Cron (e.g. 0 8 * * *)"
            defaultValue="0 8 * * *"
            required
            className="md:col-span-3 font-mono text-xs"
          />
          <Button type="submit" variant="primary" className="md:col-span-1">
            Add
          </Button>
        </form>
      </Card>

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
                <Badge tone={meta.tone} className="ml-auto">
                  {byType[type].length}
                </Badge>
              </div>
              <div className="space-y-3">
                {byType[type].map((j) => (
                  <div key={j.id} className="rounded-lg bg-black/20 border border-border-soft p-3">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-xs font-medium truncate">{j.job_name}</span>
                      <Badge tone={j.status === "active" ? "green" : "neutral"}>
                        {j.status}
                      </Badge>
                    </div>
                    <code className="text-[11px] text-accent-2 font-mono block mb-1">
                      {j.cron_expression}
                    </code>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-text-muted">
                      <span>Last: {fmt(j.last_run)}</span>
                      <span className="text-right">Next: {fmt(j.next_run)}</span>
                    </div>
                    <JobActions id={j.id} status={j.status} />
                  </div>
                ))}
                {byType[type].length === 0 && (
                  <EmptyState icon={<CalendarClock className="h-6 w-6" />} title="No jobs yet" hint="Add your first schedule above." />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
