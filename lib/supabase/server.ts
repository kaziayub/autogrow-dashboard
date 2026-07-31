import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fpteiupgrjdoraigcjhw.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdGVpdXBncmpkb3JhaWdjamh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDA5MzIsImV4cCI6MjEwMDk3NjkzMn0.sSUc6GhduRqi3TTHCNbUIFKc4PXmEQP9bd_5nC234R4";

// Server client — RLS-aware (uses the logged-in user's session).
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore, middleware refreshes.
        }
      },
    },
  });
}
