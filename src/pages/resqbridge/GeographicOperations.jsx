import React, { useState } from "react";
import { Map, Siren, Ambulance, Hospital, Layers, AlertTriangle, Crosshair, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, KpiCard } from "@/components/resqbridge/Glass";
import { AlertLevelBadge } from "@/components/resqbridge/Badges";
import CommandMap from "@/components/resqbridge/CommandMap";
import { emergencies, ambulances, hospitals, coverageGaps, heatmapPoints, PRIORITY } from "@/lib/resqbridge/mockData";

export default function GeographicOperations() {
  const [selected, setSelected] = useState("CG-01");

  const clusters = heatmapPoints.filter((p) => p.intensity >= 70);
  const highDemand = heatmapPoints.slice(0, 3);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={Siren} label="Emergency Clusters" value={clusters.length} tone="critical" sub="high intensity" />
        <KpiCard icon={Ambulance} label="Fleet Distributed" value={ambulances.filter(a => a.status !== "OFFLINE" && a.status !== "MAINTENANCE").length} tone="primary" sub="active units" />
        <KpiCard icon={Hospital} label="Hospitals" value={hospitals.length} tone="operational" sub="in network" />
        <KpiCard icon={AlertTriangle} label="Coverage Gaps" value={coverageGaps.length} tone="warning" sub="need attention" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <GlassPanel elevated className="p-4 flex flex-col h-[560px]">
            <SectionTitle icon={Map} title="Geographic Operations" action={<span className="text-xs text-rb-muted">GIS overlay</span>} />
            <div className="mt-3 flex-1 relative">
              <CommandMap height="h-full" />
              {/* Coverage gap markers overlay */}
              {coverageGaps.map((g) => (
                <button key={g.id} onClick={() => setSelected(g.id)} title={g.area}
                  style={{ left: `${g.coords.x}%`, top: `${g.coords.y}%` }}
                  className={cn("absolute -translate-x-1/2 -translate-y-1/2 z-20 group", selected === g.id && "scale-125")}>
                  <span className="flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-rb-warning/50 bg-rb-warning/80 shadow-lg pulse-critical">
                    <AlertTriangle className="w-3.5 h-3.5 text-white" strokeWidth={2.4} />
                  </span>
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="space-y-5">
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Crosshair} title="Coverage Gaps" />
            <div className="mt-3 space-y-2">
              {coverageGaps.map((g) => (
                <button key={g.id} onClick={() => setSelected(g.id)}
                  className={cn("w-full text-left glass rounded-xl p-3 transition-colors", selected === g.id ? "ring-1 ring-rb-warning/40" : "hover:bg-muted/40")}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{g.area}</span>
                    <AlertLevelBadge level={g.severity} />
                  </div>
                  <div className="text-[11px] text-rb-muted mt-1">{g.gap}</div>
                </button>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Layers} title="High-Demand Areas" />
            <div className="mt-3 space-y-2">
              {highDemand.map((p) => (
                <div key={p.id} className="glass rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground truncate">{p.area}</span>
                    <span className="text-xs font-bold font-heading text-rb-critical tabular-nums">{p.intensity}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-rb-critical" style={{ width: `${p.intensity}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Activity} title="Distribution" />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Dist icon={Siren} label="Emergencies" value={emergencies.filter(e => !["COMPLETED","CANCELLED"].includes(e.status)).length} color="text-rb-critical" />
              <Dist icon={Ambulance} label="Ambulances" value={ambulances.length} color="text-rb-primary" />
              <Dist icon={Hospital} label="Hospitals" value={hospitals.length} color="text-rb-operational" />
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function Dist({ icon: Icon, label, value, color }) {
  return (
    <div className="glass rounded-xl p-3">
      <Icon className={cn("w-5 h-5 mx-auto", color)} />
      <div className="font-heading font-extrabold text-xl text-foreground mt-1 tabular-nums">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{label}</div>
    </div>
  );
}