"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

// Subscribe to Postgres Changes on a table; revalidate the current route on any
// change so server components re-fetch fresh data. Minimal + works app-wide.
export function Realtime({
  tables,
  events = ["INSERT", "UPDATE", "DELETE"],
}: {
  tables: string[];
  events?: ("INSERT" | "UPDATE" | "DELETE")[];
}) {
  const router = useRouter();
  useEffect(() => {
    const sb = supabaseBrowser();
    const channel = sb.channel("rt-" + tables.join("-"));
    for (const table of tables) {
      for (const event of events) {
        channel.on(
          "postgres_changes",
          { event, schema: "public", table },
          () => router.refresh()
        );
      }
    }
    channel.subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [tables.join(","), events.join(","), router]);

  return null;
}
