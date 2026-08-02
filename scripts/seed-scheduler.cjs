// seed-scheduler.cjs — insert default scheduler jobs into Supabase
// Run: node scripts/seed-scheduler.cjs

const SUPABASE_URL = "https://fpteiupgrjdoraigcjhw.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdGVpdXBncmpkb3JhaWdjamh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTQwMDkzMiwiZXhwIjoyMTAwOTc2OTMyfQ.izvDBeLaj1Vph4p-mJ8kaf-HMAGen1lR14wjyYxEN4g";

const now = new Date();
const tomorrow = (h = 8) => {
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
};

const JOBS = [
  // ── SYSTEM JOBS ──────────────────────────────────────────────
  {
    job_name: "VPS Health Check (Every 5 Min)",
    job_type: "system",
    cron_expression: "*/5 * * * *",
    status: "active",
    next_run: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  },
  {
    job_name: "Server Metrics Push (Every 30s)",
    job_type: "system",
    cron_expression: "* * * * *",
    status: "active",
    next_run: new Date(Date.now() + 60 * 1000).toISOString(),
  },
  {
    job_name: "Database Auto-Backup (Nightly 2AM)",
    job_type: "system",
    cron_expression: "0 2 * * *",
    status: "active",
    next_run: tomorrow(2),
  },
  {
    job_name: "Log Cleanup — 30 Day Purge (Weekly Sunday)",
    job_type: "system",
    cron_expression: "0 3 * * 0",
    status: "active",
    next_run: tomorrow(3),
  },
  {
    job_name: "PM2 Process Watchdog (Every 10 Min)",
    job_type: "system",
    cron_expression: "*/10 * * * *",
    status: "active",
    next_run: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  },

  // ── BUSINESS JOBS ────────────────────────────────────────────
  {
    job_name: "AI News Digest — Daily 8AM",
    job_type: "business",
    cron_expression: "0 8 * * *",
    status: "active",
    next_run: tomorrow(8),
  },
  {
    job_name: "SEO Audit — zynovari.com (Weekly Mon 9AM)",
    job_type: "business",
    cron_expression: "0 9 * * 1",
    status: "active",
    next_run: tomorrow(9),
  },
  {
    job_name: "Telegram Daily Summary Report (10PM)",
    job_type: "business",
    cron_expression: "0 22 * * *",
    status: "active",
    next_run: tomorrow(22),
  },
  {
    job_name: "Website Health Monitor (Every 1 Hr)",
    job_type: "business",
    cron_expression: "0 * * * *",
    status: "active",
    next_run: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  },
  {
    job_name: "Old AI News Auto-Remove (15 Day Expiry)",
    job_type: "business",
    cron_expression: "0 0 * * *",
    status: "active",
    next_run: tomorrow(0),
  },
  {
    job_name: "Content Draft Auto-Push (Weekly Wed 10AM)",
    job_type: "business",
    cron_expression: "0 10 * * 3",
    status: "active",
    next_run: tomorrow(10),
  },

  // ── USER JOBS ─────────────────────────────────────────────────
  {
    job_name: "Client Follow-Up Reminder (Daily 11AM)",
    job_type: "user",
    cron_expression: "0 11 * * *",
    status: "active",
    next_run: tomorrow(11),
  },
  {
    job_name: "Weekly Mission Review (Friday 5PM)",
    job_type: "user",
    cron_expression: "0 17 * * 5",
    status: "active",
    next_run: tomorrow(17),
  },
  {
    job_name: "Opportunity Pipeline Scan (Daily 9AM)",
    job_type: "user",
    cron_expression: "0 9 * * *",
    status: "active",
    next_run: tomorrow(9),
  },
];

async function seed() {
  console.log(`🌱 Seeding ${JOBS.length} scheduler jobs to Supabase...\n`);

  // First, check existing jobs so we don't duplicate
  const listRes = await fetch(`${SUPABASE_URL}/rest/v1/scheduler?select=job_name`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  const existingRaw = await listRes.json();
  const existingArr = Array.isArray(existingRaw) ? existingRaw : [];
  const existingNames = new Set(existingArr.map((j) => j.job_name));

  const toInsert = JOBS.filter((j) => !existingNames.has(j.job_name)).map((j) => ({
    ...j,
    created_at: now.toISOString(),
    last_run: null,
  }));

  if (toInsert.length === 0) {
    console.log("✅ All jobs already exist. Nothing to seed.");
    return;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/scheduler`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(toInsert),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Supabase insert error:", err);
    process.exit(1);
  }

  const inserted = await res.json();
  console.log(`✅ Inserted ${inserted.length} jobs:\n`);
  inserted.forEach((j) => console.log(`  [${j.job_type.toUpperCase()}] ${j.job_name}`));
  console.log("\n🎉 Scheduler seeding complete!");
}

seed().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
