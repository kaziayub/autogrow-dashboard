import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";

// Receives "Run Now" from the Agent Swarm UI. Relays to the VPS webhook if
// VPS_WEBHOOK_URL is set; otherwise records the intent in logs so the UI flow is
// observable. ponytail: full execution lives on the (future) AWS VPS engine.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { agent?: string };
  const agent = body.agent;
  if (!agent) {
    return NextResponse.json({ error: "agent required" }, { status: 400 });
  }

  const vpsUrl = process.env.VPS_WEBHOOK_URL || "http://63.180.69.67:3005/api/trigger-agent";
  const secret = process.env.VPS_WEBHOOK_SECRET;

  // 1. Mark agent as running (optimistic, UI feedback)
  await supabaseService()
    .from("agent_control")
    .update({ status: "running", current_task: "manual_run", updated_at: new Date().toISOString() })
    .eq("agent_name", agent);

  // 2. Queue in database (Agent Tasks) for the VPS to pick up
  try {
    const { error: queueError } = await supabaseService()
      .from("agent_tasks")
      .insert({
        agent_name: agent,
        action: agent === "SEO & Site Auditor" ? "run_seo_audit" : "run_mission",
        payload: { title: `Manual Run of ${agent} from Dashboard`, url: "https://zynovari.com" },
        status: "pending",
        created_at: new Date().toISOString(),
      });

    if (queueError) throw queueError;

    await supabaseService().from("logs").insert({
      agent,
      action: "manual_run.queued",
      level: "info",
      details: { note: "Successfully queued task in database for VPS poller" },
    });

    return NextResponse.json({ ok: true, queued: true });
  } catch (err) {
    await supabaseService().from("logs").insert({
      agent,
      action: "manual_run.queue_failed",
      level: "error",
      details: { error: String(err) },
    });
    return NextResponse.json({ ok: false, error: "queue_failed" }, { status: 500 });
  }

  // 3. No engine yet — log intent + revert to idle
  await Promise.all([
    supabaseService().from("logs").insert({
      agent,
      action: "manual_run.no_engine",
      level: "warn",
      details: { note: "VPS_WEBHOOK_URL not configured" },
    }),
    supabaseService()
      .from("agent_control")
      .update({ status: "idle", current_task: null, last_run: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("agent_name", agent),
  ]);
  return NextResponse.json({ ok: true, relayed: false, note: "engine_not_connected" });
}
