import { getSeoAudits } from "@/lib/queries";
import { PageHeader, Card, EmptyState, Badge, Stat } from "@/components/ui";
import { Globe, AlertTriangle, ImageOff, FileText, Link2 } from "lucide-react";

export default async function WebsitePage() {
  const audits = await getSeoAudits();
  const latest = audits[0] ?? null;
  const avgScore = audits.length
    ? Math.round(audits.reduce((s, a) => s + (a.score ?? 0), 0) / audits.length)
    : 0;
  const totalBroken = audits.reduce(
    (s, a) => s + (Array.isArray(a.broken_links) ? a.broken_links.length : 0),
    0
  );
  const totalMissingAlt = audits.reduce((s, a) => s + (a.images_without_alt ?? 0), 0);

  return (
    <div>
      <PageHeader
        title="Website Center"
        subtitle="Live crawler audits & metadata health"
        icon={<Globe className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Audits run" value={audits.length} icon={<FileText className="h-4 w-4" />} />
        <Stat label="Avg score" value={avgScore} tone={avgScore >= 80 ? "green" : "amber"} />
        <Stat label="Broken links" value={totalBroken} tone={totalBroken ? "red" : "green"} icon={<Link2 className="h-4 w-4" />} />
        <Stat label="Missing alt" value={totalMissingAlt} tone={totalMissingAlt ? "amber" : "green"} icon={<ImageOff className="h-4 w-4" />} />
      </div>

      <Card className="mb-4">
        <h3 className="text-sm font-semibold mb-3">Latest Audit</h3>
        {!latest ? (
          <EmptyState icon={<Globe className="h-8 w-8" />} title="No audits yet" hint="Trigger an audit from the Agent Swarm once the engine is connected." />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge tone={latest.score >= 80 ? "green" : latest.score >= 50 ? "amber" : "red"}>
                Score {latest.score}
              </Badge>
              <a href={latest.url} className="text-xs text-accent-2 truncate" target="_blank" rel="noreferrer">{latest.url}</a>
            </div>
            <div className="text-xs text-text-muted">{latest.title ?? "—"}</div>
            <div className="text-xs text-text-muted">{latest.meta_description ?? "No meta description"}</div>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-3">Audit History</h3>
        {audits.length === 0 ? (
          <p className="text-xs text-text-muted">No data.</p>
        ) : (
          <div className="space-y-2">
            {audits.map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-xs py-2 border-b border-border-soft/50 last:border-0">
                <Badge tone={a.score >= 80 ? "green" : a.score >= 50 ? "amber" : "red"}>{a.score}</Badge>
                <span className="truncate flex-1">{a.url}</span>
                {a.images_without_alt ? <AlertTriangle className="h-3 w-3 text-warn" /> : null}
                <span className="text-text-muted/60">{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
