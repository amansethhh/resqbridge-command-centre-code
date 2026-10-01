import React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Flame } from "lucide-react";
import { PRIORITY } from "@/lib/resqbridge/mockData";

// Heatmap overlay built on the same map language as CommandMap so all maps
// share background, grid, controls and glass overlays.
export default function HeatmapMap({ points = [], selected, onSelect, height = "h-full", className = "" }) {
  const max = Math.max(1, ...points.map((p) => p.intensity));
  return (
    <div className={cn("relative w-full rounded-2xl glass overflow-hidden", height, className)}>
      {/* Shared backdrop */}
      <div className="absolute inset-0 grid-faint opacity-60" />
      <div className="absolute inset-0 opacity-50" style={{
        background: "radial-gradient(60% 50% at 45% 40%, hsl(var(--rb-critical)/0.06), transparent 60%), radial-gradient(50% 40% at 75% 70%, hsl(var(--rb-warning)/0.05), transparent 60%)",
      }} />
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <path d="M0,120 Q300,80 600,140 T1200,100" stroke="hsl(var(--rb-cyan)/0.25)" strokeWidth="14" fill="none" />
        <path d="M0,260 L1200,240" stroke="hsl(var(--rb-glass-border))" strokeWidth="2" fill="none" />
        <path d="M420,0 L440,500" stroke="hsl(var(--rb-glass-border))" strokeWidth="2" fill="none" />
        <path d="M780,0 L760,500" stroke="hsl(var(--rb-glass-border))" strokeWidth="2" fill="none" />
      </svg>

      <div className="absolute top-3 left-3 glass rounded-xl px-2 py-1.5 z-10 flex items-center gap-1.5">
        <Flame className="w-3.5 h-3.5 text-rb-critical" />
        <span className="text-[10px] font-bold font-heading text-rb-muted">EMERGENCY HEATMAP · 7D</span>
      </div>
      <div className="absolute top-3 right-3 glass rounded-xl px-2.5 py-1.5 z-10 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-rb-muted" />
        <span className="text-[10px] font-bold font-heading text-rb-muted">METRO GRID</span>
      </div>

      {/* Heat blobs */}
      <div className="absolute inset-0">
        {points.map((p) => {
          const ratio = p.intensity / max;
          const color = p.topPriority === PRIORITY.CRITICAL ? "hsl(var(--rb-critical))" : p.topPriority === PRIORITY.HIGH ? "hsl(var(--rb-warning))" : "hsl(var(--rb-primary))";
          const size = 40 + ratio * 80;
          return (
            <button key={p.id} onClick={() => onSelect?.(p.id)} style={{ left: `${p.coords.x}%`, top: `${p.coords.y}%` }}
              className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 hover:z-20", selected === p.id && "z-20 ring-2 ring-foreground/40")}>
              <span className="block rounded-full" style={{
                width: size, height: size,
                background: `radial-gradient(circle, ${color} 0%, ${color.replace(')', ' / 0.5)').replace('hsl', 'hsla')} 40%, transparent 70%)`,
                opacity: 0.5 + ratio * 0.35,
              }} />
              {selected === p.id && (
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap text-[10px] font-bold font-heading glass px-2 py-0.5 rounded-md text-foreground">
                  {p.area} · {p.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Intensity legend */}
      <div className="absolute bottom-3 left-3 glass rounded-lg px-2.5 py-1.5 z-10 flex items-center gap-2">
        <span className="text-[10px] font-bold font-heading text-rb-muted">LOW</span>
        <div className="w-20 h-2 rounded-full" style={{ background: "linear-gradient(90deg, hsl(var(--rb-primary)/0.4), hsl(var(--rb-warning)/0.6), hsl(var(--rb-critical)))" }} />
        <span className="text-[10px] font-bold font-heading text-rb-muted">HIGH</span>
      </div>
    </div>
  );
}