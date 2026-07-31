import { getContentDrafts } from "@/lib/queries";
import { ContentEditor } from "./editor";
import { PenLine } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// Absolute path to the sample blog posts the owner supplied.
const SAMPLE_DIR = "C:\\Users\\Kaziayub\\Downloads\\Telegram Desktop\\bloge";

// ponytail: crude HTML→text for seed content. Real import lives in the engine.
function htmlToText(html: string, file = "post"): { title: string; content: string } {
  // Filename fallback guarantees unique keys when <title> is missing/blank.
  const title = (html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "").trim() || file.replace(/\.html$/i, "");
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const text = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<h[1-6][^>]*>/gi, "\n## ")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { title, content: text };
}

async function loadSamples() {
  try {
    const files = (await readdir(SAMPLE_DIR)).filter((f) => f.endsWith(".html"));
    const out = await Promise.all(
      files.map(async (f) => {
        const html = await readFile(join(SAMPLE_DIR, f), "utf8");
        return htmlToText(html, f);
      })
    );
    return out;
  } catch {
    return [];
  }
}

export default async function ContentPage() {
  const [drafts, seedHtml] = await Promise.all([getContentDrafts(), loadSamples()]);
  return (
    <div>
      <PageHeader
        title="Content Studio"
        subtitle="Markdown editor · live preview · SEO scoring"
        icon={<PenLine className="h-5 w-5" />}
      />
      <ContentEditor drafts={drafts} seedHtml={seedHtml} />
    </div>
  );
}
