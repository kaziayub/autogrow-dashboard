"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Menu, Rocket, X, Zap, Shield, ChevronDown, Activity } from "lucide-react";

export function TopBar({ ownerName }: { ownerName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 py-2.5 mx-4 lg:mx-6 mt-4"
      style={{
        background: 'rgba(4, 8, 18, 0.88)',
        border: '1px solid rgba(0,229,255,0.12)',
        borderRadius: '4px',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 2px 40px rgba(0,0,0,0.6), 0 0 1px rgba(0,229,255,0.15) inset',
        /* Top cyan highlight line */
        borderTop: '1px solid rgba(0,229,255,0.22)',
      }}>

      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile trigger */}
        <button
          className="lg:hidden p-2 -ml-1 rounded transition-colors"
          style={{ color: 'rgba(0,229,255,0.6)' }}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded flex items-center justify-center"
            style={{ background: 'rgba(0,229,255,0.10)', border: '1px solid rgba(0,229,255,0.25)' }}>
            <Zap className="h-3.5 w-3.5" style={{ color: '#00e5ff' }} />
          </div>
          <span className="text-xs font-bold font-mono tracking-widest uppercase"
            style={{ color: '#00e5ff', textShadow: '0 0 8px rgba(0,229,255,0.5)' }}>
            AutoGrow OS
          </span>
          {/* LIVE badge */}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(0,229,255,0.06)',
              border: '1px solid rgba(0,229,255,0.20)',
              borderRadius: '2px',
              color: '#00e5ff',
            }}>
            <span className="h-1.5 w-1.5 rounded-full pulse-dot"
              style={{ background: '#00ff9d', boxShadow: '0 0 4px rgba(0,255,157,0.8)' }} />
            LIVE
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* System Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider"
          style={{
            background: 'rgba(0,229,255,0.04)',
            border: '1px solid rgba(0,229,255,0.10)',
            borderRadius: '2px',
            color: 'rgba(204,214,246,0.7)',
          }}>
          <Activity className="h-3 w-3" style={{ color: 'rgba(0,229,255,0.5)' }} />
          System Status:
          <span className="font-bold" style={{ color: '#00ff9d', textShadow: '0 0 6px rgba(0,255,157,0.6)' }}>
            NOMINAL
          </span>
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px" style={{ background: 'rgba(0,229,255,0.10)' }} />

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded flex items-center justify-center text-xs font-bold font-mono"
            style={{
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.22)',
              color: '#00e5ff',
            }}>
            {(ownerName ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <div className="text-[11px] font-semibold font-mono" style={{ color: '#ccd6f6' }}>
              {ownerName ?? "Ayub"}
            </div>
            <div className="text-[9px] font-mono uppercase tracking-widest flex items-center gap-0.5"
              style={{ color: 'rgba(0,229,255,0.35)' }}>
              Operator <ChevronDown className="h-2.5 w-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 p-4 fade-up"
            style={{ background: 'rgba(4,8,18,0.98)', borderRight: '1px solid rgba(0,229,255,0.12)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded flex items-center justify-center"
                  style={{ background: 'rgba(0,229,255,0.10)', border: '1px solid rgba(0,229,255,0.25)' }}>
                  <Rocket className="h-4 w-4" style={{ color: '#00e5ff' }} />
                </div>
                <span className="text-xs font-bold font-mono tracking-widest uppercase"
                  style={{ color: '#00e5ff' }}>AutoGrow OS</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded"
                style={{ color: 'rgba(0,229,255,0.5)' }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="space-y-0.5">
              {NAV.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} prefetch={true}
                    onClick={() => setOpen(false)}
                    className={cn("flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.97]",
                      active ? "nav-active-bar" : ""
                    )}
                    style={active
                      ? { background: 'rgba(0,229,255,0.06)', color: '#00e5ff' }
                      : { color: 'rgba(100,116,139,0.9)' }
                    }>
                    <Icon className="h-3.5 w-3.5 shrink-0" />
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
