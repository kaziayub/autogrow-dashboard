"use server";

import { revalidatePath } from "next/cache";
import { supabaseService } from "@/lib/supabase/service";

const STATUSES = [
  "pending",
  "running",
  "waiting_approval",
  "completed",
  "failed",
] as const;

export async function moveTask(taskId: string, status: string) {
  const sb = supabaseService();
  await sb
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const agent_name = String(formData.get("agent_name") ?? "executive").toLowerCase();
  const priority = String(formData.get("priority") ?? "medium");
  if (!title) return;

  const sb = supabaseService();
  const { error } = await sb.from("tasks").insert({
    title,
    agent_name,
    agent_type: agent_name,
    priority,
    status: "pending"
  });

  if (error) {
    console.error("Error creating task:", error.message);
  }

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(taskId: string) {
  const sb = supabaseService();
  await sb.from("tasks").delete().eq("id", taskId);
  revalidatePath("/tasks");
  revalidatePath("/");
}
