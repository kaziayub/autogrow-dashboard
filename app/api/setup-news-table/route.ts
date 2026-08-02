import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

export async function POST() {
  const sb = supabaseService();

  const { error } = await sb.from("ai_news").upsert(
    {
      id: "00000000-0000-0000-0000-000000000001",
      title: "Welcome to AutoGrow Daily AI Digest",
      summary: "Daily agency-focused AI news, free developer tools, API updates, and tutorials will be posted here automatically every morning at 8:00 AM.",
      category: "Agency Tools",
      source_url: "https://zynovari.com",
      created_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    const sql = `
CREATE TABLE IF NOT EXISTS public.ai_news (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  summary     TEXT NOT NULL,
  category    TEXT DEFAULT 'Agency Tools',
  source_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.ai_news (id, title, summary, category, source_url)
VALUES ('00000000-0000-0000-0000-000000000001', 'Welcome to AutoGrow Daily AI Digest', 'Daily agency-focused AI news, free developer tools, API updates, and tutorials will be posted here automatically every morning at 8:00 AM.', 'Agency Tools', 'https://zynovari.com')
ON CONFLICT (id) DO NOTHING;
    `.trim();

    return NextResponse.json({
      ok: false,
      message: "Table does not exist. Run SQL in Supabase SQL Editor.",
      sql,
      error: error.message,
    });
  }

  return NextResponse.json({ ok: true, message: "ai_news table is ready and seeded!" });
}

export async function GET() {
  return POST();
}
