"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Zap } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 p-3"
      style={{ background: 'rgba(4, 8, 18, 0.95)', borderRight: '1px solid rgba(0,229,255,0.07)' }}>

      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-3 py-3 mb-2">
        <div className="h-8 w-8 rounded flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.25)',
          }}>
          <Zap className="h-4 w-4" style={{ color: '#00e5ff' }} />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold tracking-widest uppercase font-mono"
            style={{ color: '#00e5ff', textShadow: '0 0 8px rgba(0,229,255,0.5)' }}>
            AutoGrow OS
          </div>
          <div className="text-[9px] uppercase tracking-widest mt-0.5 font-mono"
            style={{ color: 'rgba(0,229,255,0.35)' }}>
            Mission Control
          </div>
        </div>
      </div>

      {/* Top divider */}
      <div className="mb-3 mx-2" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.25), transparent)' }} />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-0.5 px-1">
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
                "flex items-center gap-3 px-3 py-2 text-xs font-mono transition-all duration-150 active:scale-[0.97] group",
                active ? "nav-active-bar" : ""
              )}
              style={active ? {
                background: 'rgba(0,229,255,0.06)',
                color: '#00e5ff',
              } : {
                color: 'rgba(100,116,139,0.9)',
              }}
            >
              <Icon className={cn("h-3.5 w-3.5 shrink-0 transition-colors",
                active ? "" : "group-hover:text-cyan-400"
              )}
                style={active ? { color: '#00e5ff' } : {}}
              />
              <span className="truncate uppercase tracking-wider text-[10px]">{item.label}</span>
              {active && (
                <span className="ml-auto w-1 h-1 rounded-full"
                  style={{ background: '#00e5ff', boxShadow: '0 0 4px rgba(0,229,255,0.8)' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom divider */}
      <div className="mt-3 mb-2 mx-2" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)' }} />

      {/* Footer */}
      <div className="px-3 pb-1 font-mono text-[9px] uppercase tracking-widest"
        style={{ color: 'rgba(0,229,255,0.20)' }}>
        v0.1 · Supabase + Next.js
      </div>
    </aside>
  );
}
