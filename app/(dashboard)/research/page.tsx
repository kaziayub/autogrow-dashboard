import { getResearchReports, getOpportunities } from "@/lib/queries";
import { PageHeader, Card, Badge, EmptyState } from "@/components/ui";
import { Microscope, Lightbulb, ExternalLink } from "lucide-react";

export default async function ResearchPage() {
  const [reports, opportunities] = await Promise.all([getResearchReports(), getOpportunities()]);
  const growth = opportunities.filter((o) => !o.category.toLowerCase().includes("seo"));

  return (
    <div>
      <PageHeader
        title="Research Hub"
        subtitle="Competitor scans, trends & growth opportunities"
        icon={<Microscope className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold mb-3">Reports</h3>
          {reports.length === 0 ? (
            <EmptyState icon={<Microscope className="h-8 w-8" />} title="No reports yet" />
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="rounded-lg bg-black/20 border border-border-soft p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-medium">{r.topic}</h4>
                    <span className="text-[10px] text-text-muted">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-text-muted mb-2">{r.summary}</p>
                  {Array.isArray(r.key_findings) && r.key_findings.length > 0 && (
                    <ul className="space-y-1 mb-2">
                      {r.key_findings.map((f, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5">
                          <span className="text-accent mt-0.5">▸</span><span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {Array.isArray(r.sources) && r.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.sources.map((s, i) => (
                        <a key={i} href={s} target="_blank" rel="noreferrer" className="text-[10px] text-accent-2 hover:underline flex items-center gap-0.5">
                          <ExternalLink className="h-2.5 w-2.5" />src{i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-warn" /> Growth Opportunities
          </h3>
          {growth.length === 0 ? (
            <EmptyState icon={<Lightbulb className="h-8 w-8" />} title="None surfaced yet" />
          ) : (
            <div className="space-y-2">
              {growth.map((o) => (
                <div key={o.id} className="rounded-lg bg-black/20 border border-border-soft p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{o.title}</span>
                    <Badge tone={o.impact === "high" ? "green" : o.impact === "medium" ? "amber" : "neutral"}>{o.impact}</Badge>
                  </div>
                  {o.description && <p className="text-xs text-text-muted">{o.description}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
