"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Rocket } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 glass-strong border-r border-border-soft rounded-none p-4">
      <div className="flex items-center gap-2.5 px-2 py-3 mb-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
          <Rocket className="h-5 w-5 text-bg" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">AutoGrow OS</div>
          <div className="text-[10px] text-text-muted uppercase tracking-widest">
            Mission Control
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto -mx-1 px-1 space-y-0.5">
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
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group active:scale-[0.98]",
                active
                  ? "bg-accent/15 text-accent border border-accent/30 font-medium"
                  : "text-text-muted hover:text-text hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="pt-3 mt-3 border-t border-border-soft text-[10px] text-text-muted px-2">
        v0.1 · Supabase + Next.js
      </div>
    </aside>
  );
}
