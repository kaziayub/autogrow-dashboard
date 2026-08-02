// migrate-scheduler.cjs — fix scheduler table schema & seed default jobs
// Run: node scripts/migrate-scheduler.cjs

const https = require("https");

const HOST = "fpteiupgrjdoraigcjhw.supabase.co";
const KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdGVpdXBncmpkb3JhaWdjamh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTQwMDkzMiwiZXhwIjoyMTAwOTc2OTMyfQ.izvDBeLaj1Vph4p-mJ8kaf-HMAGen1lR14wjyYxEN4g";

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: HOST,
      path,
      method,
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };
    const req = https.request(opts, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// Execute SQL via Supabase pg-meta (admin) endpoint
function sql(query) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query });
    const opts = {
      hostname: HOST,
      path: "/rest/v1/rpc/exec_sql",
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };
    const req = https.request(opts, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

const now = new Date();
const future = (hours) => new Date(Date.now() + hours * 3600 * 1000).toISOString();

// Default jobs matching actual schema: job_name, job_type, cron_expression, status
const JOBS = [
  // SYSTEM
  { job_name: "VPS Health Check (Every 5 Min)", job_type: "system", cron_expression: "*/5 * * * *", status: "active", next_run: future(0.1) },
  { job_name: "Server Metrics Push (Every 30s)", job_type: "system", cron_expression: "* * * * *", status: "active", next_run: future(0.02) },
  { job_name: "Database Auto-Backup (Nightly 2AM)", job_type: "system", cron_expression: "0 2 * * *", status: "active", next_run: future(12) },
  { job_name: "Log Cleanup — 30 Day Purge (Weekly)", job_type: "system", cron_expression: "0 3 * * 0", status: "active", next_run: future(48) },
  { job_name: "PM2 Process Watchdog (Every 10 Min)", job_type: "system", cron_expression: "*/10 * * * *", status: "active", next_run: future(0.17) },

  // BUSINESS
  { job_name: "AI News Digest — Daily 8AM", job_type: "business", cron_expression: "0 8 * * *", status: "active", next_run: future(16) },
  { job_name: "SEO Audit — zynovari.com (Weekly Mon)", job_type: "business", cron_expression: "0 9 * * 1", status: "active", next_run: future(24) },
  { job_name: "Telegram Daily Summary Report (10PM)", job_type: "business", cron_expression: "0 22 * * *", status: "active", next_run: future(20) },
  { job_name: "Website Health Monitor (Every 1 Hr)", job_type: "business", cron_expression: "0 * * * *", status: "active", next_run: future(1) },
  { job_name: "Old AI News Auto-Remove (15 Day Expiry)", job_type: "business", cron_expression: "0 0 * * *", status: "active", next_run: future(24) },
  { job_name: "Content Draft Auto-Push (Wed 10AM)", job_type: "business", cron_expression: "0 10 * * 3", status: "active", next_run: future(36) },

  // USER
  { job_name: "Client Follow-Up Reminder (Daily 11AM)", job_type: "user", cron_expression: "0 11 * * *", status: "active", next_run: future(17) },
  { job_name: "Weekly Mission Review (Friday 5PM)", job_type: "user", cron_expression: "0 17 * * 5", status: "active", next_run: future(72) },
  { job_name: "Opportunity Pipeline Scan (Daily 9AM)", job_type: "user", cron_expression: "0 9 * * *", status: "active", next_run: future(15) },
];

async function main() {
  console.log("🔄 Step 1: Check current scheduler table columns...");

  // Peek at current schema
  const peek = await request("GET", "/rest/v1/scheduler?limit=1", null);
  const sample = Array.isArray(peek.body) ? peek.body[0] : null;
  const hasOldSchema = sample && "task_name" in sample;
  const hasNewSchema = sample && "job_name" in sample;

  console.log("   Current columns sample:", sample ? Object.keys(sample).join(", ") : "(empty table)");

  if (hasOldSchema && !hasNewSchema) {
    console.log("\n⚠️  Old schema detected (task_name, enabled). Need to migrate.");
    console.log("   → Deleting all old rows, then adding new columns via migration...");

    // Delete old rows first
    const delRes = await request("DELETE", "/rest/v1/scheduler?id=neq.00000000-0000-0000-0000-000000000000", null);
    console.log(`   Deleted old rows: HTTP ${delRes.status}`);

    console.log("\n   ⚠️  Cannot ALTER TABLE via REST API.");
    console.log("   → Please run this SQL once in Supabase SQL Editor:");
    console.log(`
-- Run this in Supabase SQL Editor (one time):
ALTER TABLE public.scheduler
  ADD COLUMN IF NOT EXISTS job_name TEXT,
  ADD COLUMN IF NOT EXISTS job_type TEXT DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Optionally drop old columns after migration:
-- ALTER TABLE public.scheduler DROP COLUMN IF EXISTS task_name;
-- ALTER TABLE public.scheduler DROP COLUMN IF EXISTS enabled;
-- ALTER TABLE public.scheduler DROP COLUMN IF EXISTS description;

-- OR better: recreate the table cleanly:
DROP TABLE IF EXISTS public.scheduler;
CREATE TABLE public.scheduler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT UNIQUE NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'system',
  cron_expression TEXT NOT NULL,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`);
    console.log("   After running the SQL above, re-run: node scripts/migrate-scheduler.cjs");
    return;
  }

  // Check for existing jobs
  const listRes = await request("GET", "/rest/v1/scheduler?select=job_name", null);
  const existingArr = Array.isArray(listRes.body) ? listRes.body : [];
  const existingNames = new Set(existingArr.map((j) => j.job_name));
  console.log(`\n✅ Found ${existingArr.length} existing jobs in scheduler.`);

  const toInsert = JOBS
    .filter((j) => !existingNames.has(j.job_name))
    .map((j) => ({ ...j, created_at: now.toISOString(), last_run: null }));

  if (toInsert.length === 0) {
    console.log("✅ All default jobs already exist. Nothing to seed.");
    return;
  }

  console.log(`\n🌱 Inserting ${toInsert.length} new jobs...`);
  const insertRes = await request("POST", "/rest/v1/scheduler", toInsert);

  if (insertRes.status >= 400) {
    console.error("❌ Insert failed:", JSON.stringify(insertRes.body, null, 2));
    return;
  }

  const inserted = Array.isArray(insertRes.body) ? insertRes.body : [];
  console.log(`\n✅ Successfully inserted ${inserted.length} jobs:\n`);
  inserted.forEach((j) => console.log(`  [${(j.job_type||'?').toUpperCase()}] ${j.job_name}`));
  console.log("\n🎉 Scheduler seeding complete!");
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
