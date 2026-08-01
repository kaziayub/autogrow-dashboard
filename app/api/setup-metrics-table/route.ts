import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

// POST /api/setup-metrics-table
// Creates server_metrics table if it doesn't exist, then seeds row id=1.
// Call this ONCE from the browser or curl to bootstrap.
export async function POST() {
  const sb = supabaseService();

  // Try to upsert — if table missing, use raw postgres via supabase admin
  // Supabase JS client doesn't support DDL, but we can use the pg endpoint
  // The cleanest path: seed the row; if it fails with table-not-found, return SQL for manual run.
  const { error } = await sb.from("server_metrics").upsert(
    {
      id: 1,
      cpu_percent: 0,
      ram_used_mb: 0,
      ram_total_mb: 909,
      ram_percent: 0.0,
      disk_usage: "N/A",
      uptime_hours: 0,
      pm2_status: "initializing",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    // Table doesn't exist — return the SQL the user must run once in Supabase Dashboard
    const sql = `
CREATE TABLE IF NOT EXISTS public.server_metrics (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  cpu_percent  INTEGER DEFAULT 0,
  ram_used_mb  INTEGER DEFAULT 0,
  ram_total_mb INTEGER DEFAULT 0,
  ram_percent  NUMERIC(5,1) DEFAULT 0,
  disk_usage   TEXT,
  uptime_hours NUMERIC(10,2) DEFAULT 0,
  pm2_status   TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.server_metrics (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
    `.trim();

    return NextResponse.json({
      ok: false,
      message: "Table does not exist. Run the SQL below in Supabase SQL Editor.",
      sql,
      error: error.message,
    });
  }

  return NextResponse.json({ ok: true, message: "server_metrics table ready and seeded!" });
}

export async function GET() {
  return POST();
}
