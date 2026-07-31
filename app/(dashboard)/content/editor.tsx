"use client";

import { useState, useTransition, useMemo } from "react";
import { Button, Input, Card, Badge, Progress } from "@/components/ui";
import { saveDraft, createPr } from "./actions";
import type { ContentDraft } from "@/lib/types";
import { Save, GitPullRequest, FileText, Clock, Check } from "lucide-react";

// Minimal markdown → HTML (headings, bold, italic, code, links, lists, p).
// ponytail: no markdown lib. Upgrade to remark/render when rich features needed.
function mdToHtml(md: string): string {
  const esc = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let html = esc;
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^- (.*)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
  html = html.replace(/^(?!<[hupli])(.+)$/gm, "<p>$1</p>");
  return html;
}

type Check = { label: string; ok: boolean; weight: number };

function seoChecks(title: string, content: string): { checks: Check[]; score: number } {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const checks: Check[] = [
    { label: "Title 40–60 chars", ok: title.length >= 40 && title.length <= 60, weight: 20 },
    { label: "≥ 300 words", ok: words >= 300, weight: 25 },
    { label: "Has H1 (#)", ok: /^#\s/m.test(content), weight: 15 },
    { label: "Has H2 (##)", ok: /^##\s/m.test(content), weight: 10 },
    { label: "Internal link", ok: /\]\(http/.test(content), weight: 15 },
    { label: "Keyword density (repeat)", ok: Boolean(title) && (content.match(new RegExp(title.split(" ")[0], "gi"))?.length ?? 0) >= 3, weight: 15 },
  ];
  const score = Math.round(checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0));
  return { checks, score };
}

export function ContentEditor({ drafts, seedHtml }: { drafts: ContentDraft[]; seedHtml: { title: string; content: string }[] }) {
  const [selected, setSelected] = useState<ContentDraft | null>(drafts[0] ?? null);
  const [title, setTitle] = useState(drafts[0]?.title ?? "");
  const [content, setContent] = useState(drafts[0]?.content ?? "");
  const [pending, start] = useTransition();

  function pick(d: ContentDraft | { title: string; content: string; id?: string; slug?: string; status?: string }) {
    setTitle(d.title);
    setContent(d.content);
    setSelected("id" in d && d.id ? (d as ContentDraft) : null);
  }

  const { checks, score } = useMemo(() => seoChecks(title, content), [title, content]);
  const preview = useMemo(() => mdToHtml(content), [content]);

  function submit() {
    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", content);
    if (selected?.id) fd.set("id", selected.id);
    start(() => saveDraft(fd));
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
      {/* Draft list */}
      <div className="col-span-12 md:col-span-3 space-y-2 overflow-y-auto">
        <Card className="p-3">
          <p className="text-[10px] uppercase tracking-wide text-text-muted mb-2">Sample posts</p>
          {seedHtml.map((s) => (
            <button key={s.title} onClick={() => pick(s)} className="block w-full text-left text-xs px-2 py-1.5 rounded hover:bg-white/5 truncate">
              <FileText className="h-3 w-3 inline mr-1.5 text-text-muted" />{s.title}
            </button>
          ))}
        </Card>
        <Card className="p-3">
          <p className="text-[10px] uppercase tracking-wide text-text-muted mb-2">Saved drafts</p>
          {drafts.map((d) => (
            <button key={d.id} onClick={() => pick(d)} className="block w-full text-left text-xs px-2 py-1.5 rounded hover:bg-white/5">
              <div className="flex items-center gap-1.5">
                {d.status === "published" ? <Check className="h-3 w-3 text-ok" /> : <Clock className="h-3 w-3 text-text-muted" />}
                <span className="truncate">{d.title}</span>
              </div>
            </button>
          ))}
          {drafts.length === 0 && <p className="text-[11px] text-text-muted">No drafts yet.</p>}
        </Card>
      </div>

      {/* Editor */}
      <div className="col-span-12 md:col-span-6 flex flex-col gap-2 min-h-0">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title…" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write markdown here…"
          className="flex-1 rounded-lg bg-black/30 border border-border-soft px-4 py-3 text-sm font-mono text-text resize-none focus:outline-none focus:border-accent/60 min-h-0"
        />
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={submit} disabled={pending || !title}>
            <Save className="h-3.5 w-3.5" /> Save draft
          </Button>
          {selected && (
            <Button variant="outline" size="sm" onClick={() => start(() => createPr(selected.id))} disabled={pending}>
              <GitPullRequest className="h-3.5 w-3.5" /> Create PR
            </Button>
          )}
          {selected?.status === "pr_created" && <Badge tone="blue">PR created (stub)</Badge>}
        </div>
      </div>

      {/* Preview + SEO */}
      <div className="col-span-12 md:col-span-3 flex flex-col gap-2 min-h-0">
        <Card className="p-3">
          <p className="text-[10px] uppercase tracking-wide text-text-muted mb-2">SEO Score</p>
          <div className="text-2xl font-bold mb-1" style={{ color: score >= 80 ? "hsl(var(--ok))" : score >= 50 ? "hsl(var(--warn))" : "hsl(var(--danger))" }}>{score}</div>
          <Progress value={score} />
          <div className="mt-2 space-y-1">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-1.5 text-[10px]">
                <span className={c.ok ? "text-ok" : "text-text-muted"}>{c.ok ? "✓" : "○"}</span>
                <span className="text-text-muted">{c.label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 flex-1 overflow-y-auto prose-invert">
          <div className="text-sm [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h3]:font-semibold [&_a]:text-accent-2 [&_code]:text-accent [&_pre]:bg-black/40 [&_pre]:p-2 [&_pre]:rounded [&_li]:ml-4 [&_p]:my-1.5" dangerouslySetInnerHTML={{ __html: preview || "<p class='text-text-muted'>Preview…</p>" }} />
        </Card>
      </div>
    </div>
  );
}
