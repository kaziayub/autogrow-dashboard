import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { Realtime } from "@/components/realtime";
import { supabaseServer } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar ownerName={user.email ?? undefined} />
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto fade-up">
          {children}
        </main>
      </div>
      {/* Global realtime refresh for the tables the UI watches */}
      <Realtime tables={["agent_control", "tasks", "approvals", "opportunities", "logs"]} />
    </div>
  );
}
