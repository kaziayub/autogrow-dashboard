"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function createMission(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "planning");
  if (!title) return;
  const sb = await supabaseServer();
  await sb.from("missions").insert({ title, description, status });
  revalidatePath("/missions");
}

export async function updateMissionProgress(
  id: string,
  progress: number,
  status: string
) {
  const sb = await supabaseServer();
  await sb
    .from("missions")
    .update({ progress, status, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/missions");
  revalidatePath("/");
}

export async function deleteMission(id: string) {
  const sb = await supabaseServer();
  await sb.from("missions").delete().eq("id", id);
  revalidatePath("/missions");
}
