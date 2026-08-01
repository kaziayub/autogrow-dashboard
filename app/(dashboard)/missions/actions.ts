"use server";

import { revalidatePath } from "next/cache";
import { supabaseService } from "@/lib/supabase/service";

const VPS_WEBHOOK_URL = process.env.VPS_WEBHOOK_URL || "http://63.180.69.67:3005/api/trigger-agent";

export async function createMission(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "active");
  if (!title) return;

  const sb = supabaseService();
  const goal = description || title;

  const { error } = await sb.from("missions").insert({
    title,
    description,
    goal,
    status: status === "planning" ? "active" : status,
    progress: 0
  });

  if (error) {
    console.error("Error inserting mission:", error.message);
  }

  revalidatePath("/missions");
  revalidatePath("/");
}

export async function updateMissionProgress(
  id: string,
  progress: number,
  status: string
) {
  const sb = supabaseService();
  await sb
    .from("missions")
    .update({ progress, status, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/missions");
  revalidatePath("/");
}

export async function deleteMission(id: string) {
  const sb = supabaseService();
  await sb.from("missions").delete().eq("id", id);
  revalidatePath("/missions");
  revalidatePath("/");
}

export async function runMissionAction(id: string, title: string) {
  const sb = supabaseService();

  // 1. Mark mission as active
  await sb
    .from("missions")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", id);

  // 2. Write task to agent_tasks queue — VPS polls this every 10s
  await sb.from("agent_tasks").insert({
    agent_name: "Executive",
    action: "run_mission",
    payload: { mission_id: id, title },
    status: "pending",
    created_at: new Date().toISOString()
  });

  // 3. Log the trigger event
  await sb.from("logs").insert({
    agent: "Executive",
    action: `Mission triggered: ${title}`,
    level: "info",
    details: { mission_id: id, title }
  });

  // 4. Also try VPS direct webhook as fallback (may timeout if port blocked)
  const VPS_URL = process.env.VPS_WEBHOOK_URL || "http://63.180.69.67:3005/api/trigger-agent";
  fetch(VPS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_name: "Executive", action: "run_mission", payload: { mission_id: id, title } }),
    signal: AbortSignal.timeout(3000)
  }).catch(() => {}); // fire-and-forget, don't block UI

  revalidatePath("/missions");
  revalidatePath("/");
}
