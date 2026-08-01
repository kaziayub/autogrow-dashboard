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
  await sb
    .from("missions")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", id);

  try {
    await fetch(VPS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_name: "Executive",
        action: "run_mission",
        payload: { mission_id: id, title }
      })
    });
  } catch (err: any) {
    console.warn("VPS Webhook trigger note:", err.message);
  }

  revalidatePath("/missions");
  revalidatePath("/");
}
