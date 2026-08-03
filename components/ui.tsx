import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/* ──────────────────────────────────────────────────
   Card — angled clip-path sci-fi surface
────────────────────────────────────────────────── */
export function Card({
  children,
  className,
  strong,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div className={cn("cyber-card p-5 relative overflow-hidden", className)}>
      <div className="cyber-decor-tr" />
      <div className="cyber-decor-bl" />
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────
   Button
────────────────────────────────────────────────── */
export function Button({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: {
  variant?: "default" | "primary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]";
  const sizes = { sm: "px-3 py-1.5", md: "px-4 py-2" };

  const variants: Record<string, React.CSSProperties> = {
    default: {},
    primary: {},
    ghost: {},
    outline: {},
    danger: {},
  };

  // We use inline styles for the clip-path button shape
  const variantStyle: Record<string, React.CSSProperties> = {
    default: {
      background: 'rgba(0,229,255,0.04)',
      color: 'rgba(204,214,246,0.7)',
      border: '1px solid rgba(0,229,255,0.12)',
      borderRadius: '2px',
    },
    primary: {
      background: 'rgba(0,229,255,0.10)',
      color: '#00e5ff',
      border: '1px solid rgba(0,229,255,0.35)',
      borderRadius: '2px',
      textShadow: '0 0 8px rgba(0,229,255,0.5)',
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(100,116,139,0.9)',
      border: '1px solid transparent',
      borderRadius: '2px',
    },
    outline: {
      background: 'transparent',
      color: '#00e5ff',
      border: '1px solid rgba(0,229,255,0.28)',
      borderRadius: '2px',
    },
    danger: {
      background: 'rgba(239,68,68,0.08)',
      color: '#f87171',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: '2px',
    },
  };

  return (
    <button
      className={cn(base, sizes[size], className)}
      style={variantStyle[variant]}
      {...props}
    >
      {children}
    </button>
  );
}

/* ──────────────────────────────────────────────────
   Badge
────────────────────────────────────────────────── */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "blue" | "amber" | "red" | "violet";
  className?: string;
}) {
  const styles: Record<string, React.CSSProperties> = {
    neutral: { background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' },
    green:   { background: 'rgba(0,255,157,0.08)',  color: '#00ff9d', border: '1px solid rgba(0,255,157,0.25)', textShadow: '0 0 6px rgba(0,255,157,0.5)' },
    blue:    { background: 'rgba(0,229,255,0.08)',  color: '#00e5ff', border: '1px solid rgba(0,229,255,0.25)', textShadow: '0 0 6px rgba(0,229,255,0.5)' },
    amber:   { background: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' },
    red:     { background: 'rgba(239,68,68,0.08)',  color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' },
    violet:  { background: 'rgba(124,58,237,0.10)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.28)' },
  };
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider whitespace-nowrap", className)}
      style={{ ...styles[tone], borderRadius: '2px' }}
    >
      {children}
    </span>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 text-xs font-mono transition bg-[#00e5ff]/[0.03] border border-[#00e5ff]/14 rounded-[2px] text-[#ccd6f6] placeholder:text-slate-600 outline-none focus:border-[#00e5ff]/40 focus:ring-1 focus:ring-[#00e5ff]/10",
        className
      )}
      {...props}
    />
  );
}

/* ──────────────────────────────────────────────────
   Textarea
────────────────────────────────────────────────── */
export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 text-xs font-mono transition resize-y min-h-[120px] bg-[#00e5ff]/[0.03] border border-[#00e5ff]/14 rounded-[2px] text-[#ccd6f6] placeholder:text-slate-600 outline-none focus:border-[#00e5ff]/40 focus:ring-1 focus:ring-[#00e5ff]/10",
        className
      )}
      {...props}
    />
  );
}

/* ──────────────────────────────────────────────────
   Stat card — HUD readout
────────────────────────────────────────────────── */
export function Stat({
  label,
  value,
  icon,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  tone?: "neutral" | "green" | "blue" | "amber" | "red";
  hint?: string;
}) {
  const valueColor: Record<string, string> = {
    neutral: '#00e5ff',
    green: '#00ff9d',
    blue: '#00e5ff',
    amber: '#fbbf24',
    red: '#f87171',
  };
  const glowColor: Record<string, string> = {
    neutral: 'rgba(0,229,255,0.7)',
    green: 'rgba(0,255,157,0.7)',
    blue: 'rgba(0,229,255,0.7)',
    amber: 'rgba(251,191,36,0.6)',
    red: 'rgba(248,113,113,0.6)',
  };

  return (
    <Card className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      {icon && (
        <div style={{ color: 'rgba(0,229,255,0.35)' }} className="mb-0.5">
          {icon}
        </div>
      )}
      <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]"
        style={{ color: 'rgba(204,214,246,0.45)' }}>
        {label}
      </span>

      {/* Big glowing number */}
      <div className="text-4xl font-bold font-mono tracking-tight tabular-nums data-live"
        style={{
          color: valueColor[tone],
          textShadow: `0 0 20px ${glowColor[tone]}, 0 0 6px ${glowColor[tone]}`,
        }}>
        {value}
      </div>

      {/* Thin cyan divider */}
      <div className="w-10 mt-0.5" style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent)'
      }} />

      {hint && (
        <div className="text-[9px] font-mono uppercase tracking-widest"
          style={{ color: 'rgba(204,214,246,0.30)' }}>
          {hint}
        </div>
      )}
    </Card>
  );
}

/* ──────────────────────────────────────────────────
   EmptyState
────────────────────────────────────────────────── */
export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      {icon && <div className="mb-3 opacity-30" style={{ color: '#00e5ff' }}>{icon}</div>}
      <p className="text-sm font-mono uppercase tracking-wider" style={{ color: 'rgba(204,214,246,0.5)' }}>
        {title}
      </p>
      {hint && (
        <p className="text-xs mt-1 max-w-sm font-mono" style={{ color: 'rgba(204,214,246,0.25)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────
   PageHeader
────────────────────────────────────────────────── */
export function PageHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="h-9 w-9 flex items-center justify-center"
            style={{
              background: 'rgba(0,229,255,0.06)',
              border: '1px solid rgba(0,229,255,0.20)',
              borderRadius: '2px',
              color: '#00e5ff',
            }}>
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-base font-bold font-mono uppercase tracking-widest"
            style={{ color: '#e8f0ff' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-mono mt-0.5" style={{ color: 'rgba(204,214,246,0.40)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ──────────────────────────────────────────────────
   Progress — voltage / power readout bar
────────────────────────────────────────────────── */
export function Progress({ value }: { value: number }) {
  const total = 10;
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * total);
  return (
    <div className="flex gap-[3px] w-full items-center">
      {Array.from({ length: total }).map((_, i) => {
        const active = i < filled;
        const isEdge = active && i === filled - 1;
        const isPast = active && i < filled - 1;
        return (
          <div
            key={i}
            className="flex-1 transition-all duration-300"
            style={{
              height: '3px',
              borderRadius: '1px',
              background: active
                ? isEdge
                  ? '#00e5ff'
                  : 'rgba(0,229,255,0.55)'
                : 'rgba(0,229,255,0.07)',
              boxShadow: isEdge
                ? '0 0 8px rgba(0,229,255,0.9), 0 0 2px rgba(0,229,255,0.5)'
                : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
