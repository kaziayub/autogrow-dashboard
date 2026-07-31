"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

const STATUSES = [
  "pending",
  "running",
  "waiting_approval",
  "completed",
  "failed",
] as const;

export async function moveTask(taskId: string, status: string) {
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;
  const sb = await supabaseServer();
  await sb
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const agent_name = String(formData.get("agent_name") ?? "Executive");
  const priority = String(formData.get("priority") ?? "medium");
  if (!title) return;
  const sb = await supabaseServer();
  await sb.from("tasks").insert({ title, agent_name, priority });
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(taskId: string) {
  const sb = await supabaseServer();
  await sb.from("tasks").delete().eq("id", taskId);
  revalidatePath("/tasks");
  revalidatePath("/");
}
