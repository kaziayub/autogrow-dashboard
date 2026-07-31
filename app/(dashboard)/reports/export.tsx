"use client";

import { Button } from "@/components/ui";
import { Download } from "lucide-react";

type Report = {
  generated: string;
  stats: Record<string, number>;
  missions: { title: string; status: string; progress: number }[];
  content: { title: string; status: string }[];
  recentLogs: { agent: string; action: string; level: string; at: string }[];
};

function download(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButton({ report }: { report: Report }) {
  const date = new Date().toISOString().slice(0, 10);

  function exportJson() {
    download(`autogrow-report-${date}.json`, JSON.stringify(report, null, 2), "application/json");
  }

  function exportMd() {
    const md = [
      `# AutoGrow OS Report`,
      `Generated: ${new Date(report.generated).toLocaleString()}`,
      ``,
      `## Metrics`,
      ...Object.entries(report.stats).map(([k, v]) => `- **${k}**: ${v}`),
      ``,
      `## Missions`,
      ...report.missions.map((m) => `- [${m.status}] ${m.title} — ${m.progress}%`),
      ``,
      `## Content`,
      ...report.content.map((c) => `- [${c.status}] ${c.title}`),
      ``,
      `## Recent Logs`,
      ...report.recentLogs.map((l) => `- [${l.level}] ${l.agent}: ${l.action}`),
    ].join("\n");
    download(`autogrow-report-${date}.md`, md, "text/markdown");
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={exportJson}>
        <Download className="h-3.5 w-3.5" /> JSON
      </Button>
      <Button size="sm" variant="outline" onClick={exportMd}>
        <Download className="h-3.5 w-3.5" /> Markdown
      </Button>
    </div>
  );
}
