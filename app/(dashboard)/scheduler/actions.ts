"use server";

import { revalidatePath } from "next/cache";
import { supabaseService } from "@/lib/supabase/service";

export async function createJob(formData: FormData) {
  const job_name = String(formData.get("job_name") ?? "").trim();
  const job_type = (String(formData.get("job_type") ?? "user") as "system" | "business" | "user");
  const cron_expression = String(formData.get("cron_expression") ?? "0 8 * * *").trim();

  if (!job_name) return;

  const sb = supabaseService();
  const { error } = await sb.from("scheduler").insert({
    job_name,
    job_type,
    cron_expression,
    status: "active",
    created_at: new Date().toISOString(),
    next_run: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  });

  if (error) {
    console.error("createJob error:", error.message);
  }

  revalidatePath("/scheduler");
  revalidatePath("/");
}

export async function toggleJob(jobId: string, currentStatus: string) {
  const newStatus = currentStatus === "active" ? "paused" : "active";
  const sb = supabaseService();
  await sb
    .from("scheduler")
    .update({ status: newStatus })
    .eq("id", jobId);

  revalidatePath("/scheduler");
  revalidatePath("/");
}

export async function deleteJob(jobId: string) {
  const sb = supabaseService();
  await sb.from("scheduler").delete().eq("id", jobId);

  revalidatePath("/scheduler");
  revalidatePath("/");
}
