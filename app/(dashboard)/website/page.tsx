import { getSeoAudits } from "@/lib/queries";
import { PageHeader, Card, EmptyState, Badge, Stat, Input, Button } from "@/components/ui";
import { Globe, AlertTriangle, ImageOff, FileText, Link2, Plus, CheckCircle2 } from "lucide-react";
import { runAudit } from "./actions";

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

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
        subtitle="Live crawler audits & metadata health for zynovari.com & client sites"
        icon={<Globe className="h-5 w-5" />}
      />

      {/* Form card */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4 text-accent" /> Run Live Crawler Audit
        </h3>
        <form action={runAudit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <Input
            name="url"
            placeholder="Target Website URL (e.g. https://zynovari.com)"
            defaultValue="https://zynovari.com"
            required
            className="md:col-span-10 text-sm font-mono"
          />
          <Button type="submit" variant="primary" className="md:col-span-2">
            Run Audit
          </Button>
        </form>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Audits run" value={audits.length} icon={<FileText className="h-4 w-4" />} />
        <Stat label="Avg score" value={avgScore} tone={avgScore >= 80 ? "green" : "amber"} />
        <Stat label="Broken links" value={totalBroken} tone={totalBroken ? "red" : "green"} icon={<Link2 className="h-4 w-4" />} />
        <Stat label="Missing alt" value={totalMissingAlt} tone={totalMissingAlt ? "amber" : "green"} icon={<ImageOff className="h-4 w-4" />} />
      </div>

      {/* Latest Audit */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
          <span>Latest Audit Overview</span>
          {latest && <span className="text-xs text-text-muted font-normal">{timeAgo(latest.created_at)}</span>}
        </h3>
        {!latest ? (
          <EmptyState icon={<Globe className="h-8 w-8" />} title="No audits yet" hint="Run your first website audit using the form above." />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-border-soft pb-3">
              <div className="min-w-0">
                <a href={latest.url} className="text-sm font-semibold text-accent-2 hover:underline truncate block" target="_blank" rel="noreferrer">
                  {latest.url}
                </a>
                <p className="text-xs text-text-muted mt-0.5">{latest.title ?? "—"}</p>
              </div>
              <Badge tone={latest.score >= 80 ? "green" : latest.score >= 50 ? "amber" : "red"} className="text-sm px-3 py-1">
                Score {latest.score}/100
              </Badge>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{latest.meta_description ?? "No meta description found"}</p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
              <div className="rounded-lg bg-black/20 p-2 text-center border border-border-soft">
                <span className="text-text-muted text-[10px] block">H1 Tag Count</span>
                <span className="font-semibold text-text tabular-nums">{latest.h1_count ?? 1}</span>
              </div>
              <div className="rounded-lg bg-black/20 p-2 text-center border border-border-soft">
                <span className="text-text-muted text-[10px] block">Images Missing Alt</span>
                <span className="font-semibold text-ok tabular-nums">{latest.images_without_alt ?? 0}</span>
              </div>
              <div className="rounded-lg bg-black/20 p-2 text-center border border-border-soft">
                <span className="text-text-muted text-[10px] block">Broken Links</span>
                <span className="font-semibold text-ok tabular-nums">{Array.isArray(latest.broken_links) ? latest.broken_links.length : 0}</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* History */}
      <Card>
        <h3 className="text-sm font-semibold mb-3">Audit History</h3>
        {audits.length === 0 ? (
          <p className="text-xs text-text-muted">No audit history recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {audits.map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-xs py-2.5 border-b border-border-soft/50 last:border-0">
                <Badge tone={a.score >= 80 ? "green" : a.score >= 50 ? "amber" : "red"}>{a.score}/100</Badge>
                <span className="font-mono text-accent-2 truncate flex-1">{a.url}</span>
                {a.images_without_alt ? <AlertTriangle className="h-3 w-3 text-warn" /> : <CheckCircle2 className="h-3.5 w-3.5 text-ok" />}
                <span className="text-text-muted/60 tabular-nums">{timeAgo(a.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
