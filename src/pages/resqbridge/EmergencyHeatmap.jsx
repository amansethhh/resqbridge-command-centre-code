import React, { useState, useMemo } from "react";
import { Flame, Filter, MapPin, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton, KpiCard } from "@/components/resqbridge/Glass";
import { PriorityBadge, AlertLevelBadge } from "@/components/resqbridge/Badges";
import HeatmapMap from "@/components/resqbridge/HeatmapMap";
import { heatmapPoints, PRIORITY } from "@/lib/resqbridge/mockData";

const timeOptions = ["24H", "7D", "30D"];
const priorityOptions = ["ALL", ...Object.values(PRIORITY)];

export default function EmergencyHeatmap() {
  const [timeRange, setTimeRange] = useState("7D");
  const [priority, setPriority] = useState("ALL");
  const [selected, setSelected] = useState("HM-01");

  const filtered = useMemo(
    () => heatmapPoints.filter((p) => priority === "ALL" || p.topPriority === priority),
    [priority]
  );
  const sel = heatmapPoints.find((p) => p.id === selected);
  const totalIncidents = heatmapPoints.reduce((s, p) => s + p.count, 0);
  const hotspots = heatmapPoints.filter((p) => p.intensity >= 70).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={Flame} label="Hotspots" value={hotspots} tone="critical" sub="intensity ≥ 70" />
        <KpiCard icon={Activity} label="Total Incidents" value={totalIncidents} tone="primary" sub={`${timeRange} window`} />
        <KpiCard icon={MapPin} label="Clusters" value={heatmapPoints.length} tone="info" sub="distinct areas" />
        <KpiCard icon={Filter} label="Active Filter" value={priority === "ALL" ? "All" : priority} tone="warning" sub={timeRange} />
      </div>

      <GlassPanel elevated className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-4 h-4 text-rb-muted" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Time</span>
          <div className="flex items-center gap-1">
            {timeOptions.map((t) => (
              <button key={t} onClick={() => setTimeRange(t)}
                className={cn("h-8 px-3 rounded-lg text-xs font-bold font-heading transition-colors", timeRange === t ? "bg-rb-primary/12 text-rb-primary" : "glass text-rb-muted hover:text-foreground")}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="glass rounded-xl h-10 flex items-center gap-2 pl-3 pr-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="bg-transparent outline-none text-sm font-semibold text-foreground cursor-pointer pr-1">
            {priorityOptions.map((o) => <option key={o} value={o} className="bg-card">{o === "ALL" ? "All" : o}</option>)}
          </select>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <GlassPanel elevated className="p-4 flex flex-col h-[520px]">
            <SectionTitle icon={Flame} title="Emergency Heatmap" />
            <div className="mt-3 flex-1"><HeatmapMap points={filtered} selected={selected} onSelect={setSelected} height="h-full" /></div>
          </GlassPanel>
        </div>

        <div className="space-y-5">
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={MapPin} title="Selected Area" />
            {sel ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-foreground">{sel.area}</span>
                  <PriorityBadge priority={sel.topPriority} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass rounded-xl p-3"><div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Incidents</div><div className="font-heading font-extrabold text-2xl text-foreground tabular-nums">{sel.count}</div></div>
                  <div className="glass rounded-xl p-3"><div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Intensity</div><div className="font-heading font-extrabold text-2xl text-rb-critical tabular-nums">{sel.intensity}</div></div>
                </div>
              </div>
            ) : <div className="text-sm text-rb-muted mt-3">Select a hotspot on the map.</div>}
          </GlassPanel>

          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Activity} title="Top Hotspots" />
            <div className="mt-3 space-y-2">
              {[...heatmapPoints].sort((a, b) => b.intensity - a.intensity).slice(0, 5).map((p) => (
                <button key={p.id} onClick={() => setSelected(p.id)}
                  className={cn("w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-colors text-left", selected === p.id ? "bg-rb-critical/10 ring-1 ring-rb-critical/30" : "glass hover:bg-muted/40")}>
                  <span className="text-sm font-semibold text-foreground truncate">{p.area}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold font-heading text-foreground tabular-nums">{p.count}</span>
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-rb-critical" style={{ width: `${p.intensity}%` }} /></div>
                  </div>
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}