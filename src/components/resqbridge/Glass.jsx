import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Frosted glass surface — the base container for all panels.
export function GlassPanel({ className, elevated = false, children, ...props }) {
  return (
    <div className={cn(elevated ? "glass-elevated" : "glass", "rounded-2xl", className)} {...props}>
      {children}
    </div>
  );
}

// Section heading with optional icon + action slot.
export function SectionTitle({ icon: Icon, title, action, className = "" }) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className="icon-tile rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-rb-primary" strokeWidth={2.2} />
          </div>
        )}
        <h2 className="font-heading font-bold text-[15px] tracking-tight text-foreground truncate">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

// Compact KPI card with 3D icon tile, value and delta.
export function KpiCard({ icon: Icon, label, value, tone = "primary", sub, pulse = false }) {
  const toneMap = {
    primary: "text-rb-primary",
    critical: "text-rb-critical",
    operational: "text-rb-operational",
    warning: "text-rb-warning",
    info: "text-rb-info",
  };
  const ringMap = {
    primary: "ring-rb-primary/20",
    critical: "ring-rb-critical/25",
    operational: "ring-rb-operational/20",
    warning: "ring-rb-warning/25",
    info: "ring-rb-info/20",
  };
  return (
    <GlassPanel className={cn("p-4 flex items-center gap-3.5 relative overflow-hidden", pulse && "pulse-critical")}>
      <div className={cn("icon-tile rounded-xl w-11 h-11 flex items-center justify-center shrink-0 ring-1", ringMap[tone])}>
        <Icon className={cn("w-5 h-5", toneMap[tone])} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-rb-muted truncate">{label}</div>
        <div className="font-heading font-extrabold text-2xl leading-tight text-foreground tabular-nums">{value}</div>
        {sub && <div className="text-[11px] text-rb-muted truncate mt-0.5">{sub}</div>}
      </div>
    </GlassPanel>
  );
}

// 3D control button system.
const variants = {
  primary: "bg-rb-primary text-primary-foreground hover:bg-rb-primary/90 shadow-[0_8px_20px_-8px_hsl(var(--rb-primary)/0.6)]",
  danger: "bg-rb-critical text-white hover:bg-rb-critical/90 shadow-[0_8px_20px_-8px_hsl(var(--rb-critical)/0.55)]",
  warning: "bg-rb-warning text-white hover:bg-rb-warning/90 shadow-[0_8px_20px_-8px_hsl(var(--rb-warning)/0.55)]",
  success: "bg-rb-operational text-white hover:bg-rb-operational/90 shadow-[0_8px_20px_-8px_hsl(var(--rb-operational)/0.5)]",
  secondary: "glass text-foreground hover:bg-muted/60",
  ghost: "bg-transparent text-rb-muted hover:text-foreground hover:bg-muted/50",
};

export function CommandButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  className = "",
  ...props
}) {
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
    md: "h-10 px-4 text-sm gap-2 rounded-xl",
    lg: "h-12 px-5 text-sm gap-2 rounded-xl",
  };
  return (
    <button
      className={cn(
        "btn-sheen inline-flex items-center justify-center font-semibold font-heading transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-50 disabled:pointer-events-none",
        sizes[size],
        variants[variant],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4 shrink-0" strokeWidth={2.2} />}
      {children}
    </button>
  );
}

// Ghost glass icon-only button.
export function IconButton({ icon: Icon, label, active = false, className = "", ...props }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "icon-tile rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        active && "ring-2 ring-rb-primary/50",
        className
      )}
      {...props}
    >
      <Icon className={cn("w-[18px] h-[18px]", active ? "text-rb-primary" : "text-rb-muted")} strokeWidth={2.2} />
    </button>
  );
}

// Skeleton loader for glass content.
export function Skeleton({ className = "" }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted/50", className)} />;
}