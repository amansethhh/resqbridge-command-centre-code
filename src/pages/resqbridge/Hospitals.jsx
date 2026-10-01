import React from "react";
import { Link } from "react-router-dom";
import { Hospital, Bed, Activity, ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, KpiCard } from "@/components/resqbridge/Glass";
import { HospitalStatusBadge } from "@/components/resqbridge/Badges";
import { hospitals, HOSPITAL_STATUS } from "@/lib/resqbridge/mockData";

function cap(pct) {
  return pct >= 90 ? "bg-rb-critical" : pct >= 70 ? "bg-rb-warning" : "bg-rb-operational";
}

export default function Hospitals() {
  const counts = Object.values(HOSPITAL_STATUS).map((s) => ({
    s,
    n: hospitals.filter((h) => h.status === s).length,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {counts.map((c) => (
          <KpiCard key={c.s} icon={Hospital} label={c.s.replace(/_/g, " ")} value={c.n} tone={c.s === "CRITICAL" ? "critical" : c.s === "OPERATIONAL" ? "operational" : "warning"} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {hospitals.map((h) => {
          const edPct = Math.round((h.ed.used / h.ed.total) * 100);
          const icuPct = Math.round((h.icu.used / h.icu.total) * 100);
          const traumaPct = Math.round((h.trauma.used / h.trauma.total) * 100);
          return (
            <GlassPanel key={h.id} elevated className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="icon-tile rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
                    <Hospital className="w-5 h-5 text-rb-operational" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-bold text-foreground truncate">{h.name}</div>
                    <div className="text-xs text-rb-muted flex items-center gap-1"><MapPin className="w-3 h-3" />Sector {h.coords.x},{h.coords.y}</div>
                  </div>
                </div>
                <HospitalStatusBadge status={h.status} />
              </div>

              <div className="mt-4 space-y-3">
                <CapacityBar label="Emergency Dept" used={h.ed.used} total={h.ed.total} pct={edPct} />
                <CapacityBar label="ICU" used={h.icu.used} total={h.icu.total} pct={icuPct} />
                <CapacityBar label="Trauma" used={h.trauma.used} total={h.trauma.total} pct={traumaPct} />
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                <span className="text-xs text-rb-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {h.incoming} incoming {h.incoming === 1 ? "case" : "cases"}
                </span>
                <Link to="/maps" className="text-xs font-bold text-rb-primary hover:underline flex items-center gap-1">
                  View on map <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}

function CapacityBar({ label, used, total, pct }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-rb-muted" />{label}</span>
        <span className="font-bold font-heading text-foreground tabular-nums">{used}/{total} <span className="text-rb-muted font-normal">({pct}%)</span></span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", cap(pct))} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}