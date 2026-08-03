"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Zap } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-black/60 border-r border-[#00ff66]/20 rounded-none p-4">
      <div className="flex items-center gap-2.5 px-2 py-3 mb-4 border-b border-[#00ff66]/10">
        <div className="h-9 w-9 rounded-xl border border-[#00ff66]/40 bg-[#00ff66]/10 flex items-center justify-center">
          <Zap className="h-5 w-5 text-[#00ff66] cyber-glow animate-pulse" />
        </div>
        <div className="font-mono text-left">
          <div className="text-sm font-bold text-[#00ff66] tracking-wider cyber-glow leading-none">AutoGrow OS</div>
          <div className="text-[9px] text-[#00ff66]/70 uppercase tracking-widest mt-1">
            Mission Control
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto -mx-1 px-1 space-y-1 scrollbar-thin">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded font-mono text-xs transition-all group active:scale-[0.98]",
                active
                  ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40 font-bold cyber-glow"
                  : "text-[#4e8267] hover:text-[#00ff66] hover:bg-[#00ff66]/5 border border-transparent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="pt-3 mt-3 border-t border-[#00ff66]/10 text-[9px] font-mono text-[#00ff66]/50 px-2 text-left">
        v0.1 · Supabase + Next.js
      </div>
    </aside>
  );
}
