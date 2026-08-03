"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Bell, Menu, Rocket, Search, X, Zap, Shield, ChevronDown } from "lucide-react";

export function TopBar({ ownerName }: { ownerName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = NAV.find((n) =>
    n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)
  );

  return (
    <header className="sticky top-0 z-30 bg-black/40 border border-[#00ff66]/30 px-4 lg:px-6 py-3 flex items-center justify-between gap-4 mx-4 lg:mx-6 mt-4 rounded-lg shadow-[0_0_15px_rgba(0,255,102,0.05)]">
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile nav trigger */}
        <button
          className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-white/5 text-[#00ff66]"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2.5">
          <Zap className="h-5 w-5 text-[#00ff66] cyber-glow animate-pulse" />
          <span className="font-mono text-base font-bold tracking-wider text-[#00ff66] cyber-glow">
            AutoGrow OS
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/30 text-[10px] font-bold text-[#00ff66] uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-ping" />
            LIVE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* System Status: NOMINAL */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded border border-[#00ff66]/30 bg-[#00ff66]/5 text-xs text-[#00ff66] font-mono tracking-wider font-semibold">
          <Shield className="h-4 w-4" />
          SYSTEM STATUS: <span className="cyber-glow">NOMINAL</span>
        </div>

        {/* Profile Operator info */}
        <div className="flex items-center gap-2 pl-4 border-l border-[#00ff66]/20">
          <div className="h-8 w-8 rounded-full border border-[#00ff66]/40 bg-[#00ff66]/10 flex items-center justify-center text-[#00ff66] font-bold text-xs">
            {(ownerName ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block leading-tight font-mono text-left">
            <div className="text-xs font-semibold text-[#00ff66]">{ownerName ?? "Ayub"}</div>
            <div className="text-[10px] text-[#00ff66]/70 flex items-center gap-1">
              Operator <ChevronDown className="h-3 w-3" />
            </div>
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
