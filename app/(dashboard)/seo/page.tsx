import { getSeoAudits, getOpportunities } from "@/lib/queries";
import { PageHeader, Card, EmptyState, Badge, Progress } from "@/components/ui";
import { TrendingUp, Gauge, Zap, Search } from "lucide-react";

export default async function SeoPage() {
  const [audits, opportunities] = await Promise.all([getSeoAudits(), getOpportunities()]);
  const latest = audits[0] ?? null;
  const seoOpps = opportunities.filter((o) => o.category.toLowerCase().includes("seo"));

  return (
    <div>
      <PageHeader
        title="SEO Center"
        subtitle="Technical health & keyword opportunities"
        icon={<TrendingUp className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Core health */}
        <Card className="lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2 mb-4 text-text-muted">
            <Gauge className="h-4 w-4 text-accent" /> Latest Score
          </h3>
          {!latest ? (
            <EmptyState icon={<Gauge className="h-8 w-8" />} title="No audit" />
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className={`text-5xl font-bold ${latest.score >= 80 ? "text-ok" : latest.score >= 50 ? "text-warn" : "text-danger"}`}>
                {latest.score}
              </div>
              <div className="text-xs text-text-muted mt-1">/ 100</div>
              <div className="w-full mt-4"><Progress value={latest.score} /></div>
              <div className="grid grid-cols-2 gap-3 w-full mt-4 text-xs">
                <div className="text-center">
                  <div className="text-text-muted">H1 tags</div>
                  <div className="font-semibold">{latest.h1_count ?? 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-text-muted">Missing alt</div>
                  <div className="font-semibold">{latest.images_without_alt ?? 0}</div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Recommendations */}
        <Card className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2 mb-4 text-text-muted">
            <Zap className="h-4 w-4 text-warn" /> AI Recommendations
          </h3>
          {latest?.score !== undefined && latest.score < 90 ? (
            <div className="space-y-2 text-sm">
              {latest.h1_count && latest.h1_count > 1 && <Rec>Multiple H1 tags detected — keep one primary heading per page.</Rec>}
              {latest.images_without_alt && latest.images_without_alt > 0 && <Rec>{latest.images_without_alt} images missing alt text — add descriptive alts for accessibility & image SEO.</Rec>}
              {!latest.meta_description && <Rec>Missing meta description — write a 150–160 char summary.</Rec>}
              {Array.isArray(latest.broken_links) && latest.broken_links.length > 0 && <Rec>{latest.broken_links.length} broken links found — fix or remove them.</Rec>}
              <Rec>Submit an updated XML sitemap and request re-indexing in Google Search Console.</Rec>
            </div>
          ) : latest ? (
            <p className="text-sm text-ok">Excellent — latest audit scored {latest.score}. No critical issues.</p>
          ) : (
            <EmptyState icon={<Search className="h-8 w-8" />} title="No data yet" />
          )}
        </Card>
      </div>

      {/* Keyword opportunities */}
      <Card className="mt-4">
        <h3 className="text-sm font-semibold mb-3">Keyword Opportunities</h3>
        {seoOpps.length === 0 ? (
          <EmptyState icon={<TrendingUp className="h-8 w-8" />} title="No opportunities tracked" hint="The Research agent will surface these." />
        ) : (
          <div className="space-y-2">
            {seoOpps.map((o) => (
              <div key={o.id} className="flex items-center gap-3 text-xs py-2 border-b border-border-soft/50 last:border-0">
                <Badge tone={o.impact === "high" ? "green" : o.impact === "medium" ? "amber" : "neutral"}>{o.impact}</Badge>
                <span className="font-medium flex-1 truncate">{o.title}</span>
                {o.description && <span className="text-text-muted truncate hidden md:block">{o.description}</span>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Rec({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-text-muted">
      <span className="text-warn mt-0.5">▸</span>
      <span>{children}</span>
    </div>
  );
}
