import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

export async function POST() {
  const sb = supabaseService();

  const defaultJobs = [
    {
      id: "10000000-0000-0000-0000-000000000001",
      job_name: "Midnight System Cleanup & Self-Update",
      job_type: "system",
      cron_expression: "0 0 * * *",
      status: "active",
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "10000000-0000-0000-0000-000000000002",
      job_name: "Real-time VPS Telemetry & Health Check",
      job_type: "system",
      cron_expression: "*/30 * * * * *",
      status: "active",
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 30000).toISOString(),
    },
    {
      id: "20000000-0000-0000-0000-000000000001",
      job_name: "Daily Agency AI News Digest (8:00 AM)",
      job_type: "business",
      cron_expression: "0 8 * * *",
      status: "active",
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "20000000-0000-0000-0000-000000000002",
      job_name: "Weekly SEO Crawler & Audit on zynovari.com",
      job_type: "business",
      cron_expression: "0 9 * * 1",
      status: "active",
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "20000000-0000-0000-0000-000000000003",
      job_name: "Daily Social Media Post Generator (10:00 AM)",
      job_type: "business",
      cron_expression: "0 10 * * *",
      status: "active",
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "30000000-0000-0000-0000-000000000001",
      job_name: "Daily Morning Executive Summary for Ayub (9:00 AM)",
      job_type: "user",
      cron_expression: "0 9 * * *",
      status: "active",
      last_run: new Date().toISOString(),
      next_run: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    },
  ];

  for (const job of defaultJobs) {
    await sb.from("scheduler").upsert(job, { onConflict: "id" });
  }

  return NextResponse.json({ ok: true, message: "Scheduler jobs seeded successfully!" });
}

export async function GET() {
  return POST();
}
