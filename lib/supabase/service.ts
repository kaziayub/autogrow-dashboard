import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS. ONLY for trusted server-side routes
// (seed, chat relay, trigger-agent relay). Never import in client code.
export const supabaseService = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
