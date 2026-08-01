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

  // 2. Relay to VPS engine if connected
  if (vpsUrl) {
    try {
      const res = await fetch(vpsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret ? { "x-webhook-secret": secret } : {}),
        },
        body: JSON.stringify({ agent, source: "dashboard" }),
        signal: AbortSignal.timeout(8000),
      });
      await supabaseService().from("logs").insert({
        agent,
        action: "manual_run.relayed",
        level: "info",
        details: { status: res.status },
      });
      return NextResponse.json({ ok: true, relayed: true, status: res.status });
    } catch (err) {
      await supabaseService().from("logs").insert({
        agent,
        action: "manual_run.relay_failed",
        level: "error",
        details: { error: String(err) },
      });
      return NextResponse.json({ ok: false, error: "relay_failed" }, { status: 502 });
    }
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
