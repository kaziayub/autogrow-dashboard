import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

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
  const variants: Record<string, string> = {
    default:
      "bg-white/5 hover:bg-white/10 text-text border border-border-soft",
    primary:
      "bg-accent text-bg font-semibold hover:brightness-110 border border-transparent",
    ghost: "hover:bg-white/5 text-text-muted hover:text-text border border-transparent",
    outline:
      "bg-transparent hover:bg-white/5 text-text border border-border-strong",
    danger:
      "bg-danger/15 text-danger hover:bg-danger/25 border border-danger/30",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "blue" | "amber" | "red" | "violet";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/8 text-text-muted border-border-soft",
    green: "bg-ok/15 text-ok border-ok/30",
    blue: "bg-accent-2/15 text-accent-2 border-accent-2/30",
    amber: "bg-warn/15 text-warn border-warn/30",
    red: "bg-danger/15 text-danger border-danger/30",
    violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap",
        tones[tone],
        className
      )}
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
        "w-full rounded-lg bg-black/30 border border-border-soft px-3 py-2 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg bg-black/30 border border-border-soft px-3 py-2 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition resize-y min-h-[120px] font-mono",
        className
      )}
      {...props}
    />
  );
}

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
  return (
    <Card className="flex flex-col items-center justify-center gap-2.5 py-6 font-mono text-center">
      {icon && <div className="text-[#00ff66]/70 mb-0.5">{icon}</div>}
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#00ff66]/70">
        {label}
      </span>
      <div className="text-4xl font-extrabold text-[#00ff66] cyber-glow tracking-tight tabular-nums">
        {value}
      </div>
      
      {/* Decorative horizontal dots/line as seen in screenshot */}
      <div className="flex items-center gap-1.5 w-16 opacity-50 mt-1">
        <div className="h-[1px] flex-1 bg-[#00ff66]/30" />
        <div className="h-1 w-1 rounded-full bg-[#00ff66]" />
        <div className="h-[1px] flex-1 bg-[#00ff66]/30" />
      </div>

      {hint && (
        <div className="text-[9px] text-[#4e8267]/80 uppercase tracking-wider mt-1">
          {hint}
        </div>
      )}
    </Card>
  );
}

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
    <div className="flex flex-col items-center justify-center text-center py-16 text-text-muted">
      {icon && <div className="mb-3 opacity-50">{icon}</div>}
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="text-xs mt-1 max-w-sm">{hint}</p>}
    </div>
  );
}

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
          <div className="h-10 w-10 rounded-xl glass flex items-center justify-center text-accent">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

// Progress bar (0-100)
export function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
