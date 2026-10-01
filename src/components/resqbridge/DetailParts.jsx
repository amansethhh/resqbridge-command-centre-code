import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandButton } from "@/components/resqbridge/Glass";

export function PageHeader({ icon: Icon, title, badges, subtitle, onBack, backLabel = "Back", to, actions, tone }) {
  const tones = { critical: "ring-rb-critical/30 text-rb-critical", warning: "ring-rb-warning/30 text-rb-warning", primary: "ring-rb-primary/30 text-rb-primary", operational: "ring-rb-operational/30 text-rb-operational" };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {onBack && (
        <CommandButton variant="secondary" size="sm" icon={ArrowLeft} onClick={onBack}>{backLabel}</CommandButton>
      )}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {Icon && (
          <div className={cn("icon-tile rounded-xl w-11 h-11 flex items-center justify-center shrink-0", tone && tones[tone] && `ring-2 ${tones[tone]}`)}>
            <Icon className={cn("w-5 h-5", tone && tones[tone] ? tones[tone].split(" ")[1] : "text-rb-primary")} />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading font-extrabold text-xl text-foreground truncate">{title}</h1>
            {badges}
          </div>
          {subtitle && <div className="text-sm text-rb-muted mt-0.5 truncate">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function DetailField({ label, value, icon: Icon, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-xs text-rb-muted flex items-center gap-1.5 shrink-0">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className={cn("text-sm font-semibold text-foreground text-right truncate", mono && "font-mono text-xs")}>{value || "—"}</span>
    </div>
  );
}

export function DetailGroup({ icon: Icon, title, action, children }) {
  return (
    <div className="glass-elevated rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <div className="icon-tile rounded-lg w-8 h-8 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-rb-primary" strokeWidth={2.2} /></div>}
          <h2 className="font-heading font-bold text-sm text-foreground truncate">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function HistoryList({ items }) {
  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-3.5 h-3.5 rounded-full mt-1 shrink-0 ring-4 ring-card bg-rb-primary" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{it.event}</span>
                <span className="text-[11px] font-mono text-rb-muted tabular-nums">{it.time}</span>
              </div>
              {it.meta && <div className="text-[11px] text-rb-muted">{it.meta}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LinkRow({ to, icon: Icon, label, value, sub }) {
  return (
    <Link to={to} className="flex items-center gap-3 glass rounded-xl p-3 hover:scale-[1.01] transition-transform">
      <div className="icon-tile rounded-lg w-9 h-9 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-rb-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{label}</div>
        <div className="text-sm font-semibold text-foreground truncate">{value}</div>
        {sub && <div className="text-[11px] text-rb-muted truncate">{sub}</div>}
      </div>
      <ChevronRight className="w-4 h-4 text-rb-muted shrink-0" />
    </Link>
  );
}