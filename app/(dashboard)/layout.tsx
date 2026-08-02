import { cookies } from "next/headers";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { Realtime } from "@/components/realtime";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already handles auth gating & session verification.
  // We read the cookie store to extract owner email without making a duplicate external HTTP round-trip.
  const cookieStore = await cookies();
  const ownerEmail = cookieStore.get("sb-owner-email")?.value || "Ayub";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar ownerName={ownerEmail} />
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto fade-up">
          {children}
        </main>
      </div>
      {/* Global realtime refresh for the tables the UI watches */}
      <Realtime tables={["agent_control", "tasks", "approvals", "opportunities", "logs"]} />
    </div>
  );
}
