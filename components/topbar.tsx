"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Bell, Menu, Rocket, Search, X } from "lucide-react";

export function TopBar({ ownerName }: { ownerName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = NAV.find((n) =>
    n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)
  );

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border-soft px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile nav trigger */}
        <button
          className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-white/5"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="lg:hidden flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
            <Rocket className="h-4 w-4 text-bg" />
          </div>
        </div>
        <h2 className="text-sm font-semibold truncate">
          {current?.label ?? "Mission Control"}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-border-soft text-text-muted text-xs w-56">
          <Search className="h-3.5 w-3.5" />
          <span className="text-text-muted/70">Search…</span>
        </div>
        <button
          className="relative p-2 rounded-lg hover:bg-white/5 text-text-muted"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border-soft">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-bg font-bold text-xs">
            {(ownerName ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-medium">{ownerName ?? "Ayub"}</div>
            <div className="text-[10px] text-text-muted">Owner</div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 glass-strong border-r border-border-soft p-4 fade-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-bg" />
                </div>
                <span className="font-semibold text-sm">AutoGrow OS</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-0.5">
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
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all active:scale-[0.98]",
                      active
                        ? "bg-accent/15 text-accent font-medium"
                        : "text-text-muted hover:text-text hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
