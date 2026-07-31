import { createBrowserClient } from "@supabase/ssr";

// Browser client (client components, realtime subscriptions).
export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
