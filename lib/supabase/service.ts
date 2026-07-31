import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fpteiupgrjdoraigcjhw.supabase.co";
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdGVpdXBncmpkb3JhaWdjamh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTQwMDkzMiwiZXhwIjoyMTAwOTc2OTMyfQ.izvDBeLaj1Vph4p-mJ8kaf-HMAGen1lR14wjyYxEN4g";

// Service-role client — bypasses RLS. ONLY for trusted server-side routes
// (seed, chat relay, trigger-agent relay). Never import in client code.
export const supabaseService = () =>
  createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
