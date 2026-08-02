import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

export async function POST() {
  const sb = supabaseService();

  const initialAudit = {
    id: "00000000-0000-0000-0000-000000000001",
    url: "https://zynovari.com",
    score: 94,
    title: "Zynovari | Premium Software Engineering & Digital Agency",
    meta_description: "Custom software development, web applications, mobile apps, and AI solutions for high-growth businesses.",
    h1_count: 1,
    images_without_alt: 0,
    broken_links: [],
    created_at: new Date().toISOString(),
  };

  const { error } = await sb.from("seo_audits").upsert(initialAudit, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  return NextResponse.json({ ok: true, message: "Initial zynovari.com SEO audit seeded!" });
}

export async function GET() {
  return POST();
}
