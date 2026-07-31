import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fpteiupgrjdoraigcjhw.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdGVpdXBncmpkb3JhaWdjamh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDA5MzIsImV4cCI6MjEwMDk3NjkzMn0.sSUc6GhduRqi3TTHCNbUIFKc4PXmEQP9bd_5nC234R4";

// Browser client (client components, realtime subscriptions).
export const supabaseBrowser = () =>
  createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
