"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function saveDraft(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!title) return;
  const slug = slugify(title);
  const sb = await supabaseServer();

  if (id) {
    await sb
      .from("content_drafts")
      .update({ title, slug, content, updated_at: new Date().toISOString() })
      .eq("id", id);
  } else {
    await sb.from("content_drafts").insert({ title, slug, content });
  }
  revalidatePath("/content");
}

// ponytail: real GitHub PR creation needs octokit + repo. Stubbed until the VPS
// engine exists. Upgrade: POST to GitHub /repos/:owner/:repo/pulls.
export async function createPr(draftId: string) {
  const sb = await supabaseServer();
  await sb
    .from("content_drafts")
    .update({
      status: "pr_created",
      github_pr_url: null, // would be the real PR URL
      updated_at: new Date().toISOString(),
    })
    .eq("id", draftId);
  revalidatePath("/content");
}
