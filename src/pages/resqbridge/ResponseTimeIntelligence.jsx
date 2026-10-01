import React, { useState } from "react";
import { Clock, Send, Navigation, Hospital, Activity, ArrowDownRight, ArrowUpRight, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, KpiCard } from "@/components/resqbridge/Glass";
import { ChartCard, TrendLine, BarSeries, MetricCard } from "@/components/resqbridge/Charts";
import { responseHotspots, operationsAnalytics } from "@/lib/resqbridge/mockData";

const rangeOptions = ["Today", "7 Days", "30 Days", "Custom"];

const dispatchTrend = [
  { day: "Mon", dispatch: 1.6, travel: 3.4, arrival: 12.2, handover: 7.4 },
  { day: "Tue", dispatch: 1.4, travel: 3.1, arrival: 11.6, handover: 6.9 },
  { day: "Wed", dispatch: 1.9, travel: 3.6, arrival: 12.8, handover: 7.6 },
  { day: "Thu", dispatch: 1.5, travel: 3.0, arrival: 11.2, handover: 6.7 },
  { day: "Fri", dispatch: 2.1, travel: 4.1, arrival: 13.4, handover: 8.0 },
  { day: "Sat", dispatch: 1.7, travel: 3.3, arrival: 12.0, handover: 7.1 },
  { day: "Sun", dispatch: 1.3, travel: 2.8, arrival: 10.6, handover: 6.2 },
];

export default function ResponseTimeIntelligence() {
  const [range, setRange] = useState("7 Days");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard icon={Timer} label="Avg Response" value={`${operationsAnalytics.averages.responseTime}m`} tone="primary" />
        <KpiCard icon={Send} label="Avg Dispatch" value={`${operationsAnalytics.averages.dispatchTime}m`} tone="info" />
        <KpiCard icon={Navigation} label="Avg Travel" value="3.4m" tone="warning" />
        <KpiCard icon={Hospital} label="Avg Arrival" value={`${operationsAnalytics.averages.hospitalArrival}m`} tone="operational" />
        <KpiCard icon={Activity} label="Avg Handover" value={`${operationsAnalytics.averages.handover}m`} tone="primary" />
      </div>

      <GlassPanel elevated className="p-3 flex items-center gap-2 flex-wrap">
        <Clock className="w-4 h-4 text-rb-muted" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Range</span>
        {rangeOptions.map((r) => (
          <button key={r} onClick={() => setRange(r)}
            className={cn("h-8 px-3 rounded-lg text-xs font-bold font-heading transition-colors", range === r ? "bg-rb-primary/12 text-rb-primary" : "glass text-rb-muted hover:text-foreground")}>
            {r}
          </button>
        ))}
      </GlassPanel>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <ChartCard title="Response Time Breakdown" icon={Clock}>
            <TrendLine data={dispatchTrend} xKey="day" yKeys={["dispatch", "travel", "arrival", "handover"]}
              colors={["hsl(var(--rb-primary))", "hsl(var(--rb-cyan))", "hsl(var(--rb-operational))", "hsl(var(--rb-warning))"]} height={260} />
          </ChartCard>
          <ChartCard title="Daily Dispatch vs Travel" icon={Send}>
            <BarSeries data={dispatchTrend} xKey="day" yKeys={["dispatch", "travel"]}
              colors={["hsl(var(--rb-primary))", "hsl(var(--rb-cyan))"]} height={240} />
          </ChartCard>
        </div>

        <div className="space-y-5">
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Activity} title="Trend Cards" />
            <div className="mt-3 space-y-2">
              <TrendCard label="Avg Response" value="6.4m" delta="-0.3m" up={false} good />
              <TrendCard label="Avg Dispatch" value="1.6m" delta="+0.1m" up />
              <TrendCard label="Avg Handover" value="7.2m" delta="-0.4m" up={false} good />
              <TrendCard label="Avg Hospital Arrival" value="12.1m" delta="+0.5m" up />
            </div>
          </GlassPanel>

          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Navigation} title="By Area" />
            <div className="mt-3 space-y-2">
              {responseHotspots.map((h) => (
                <div key={h.id} className="glass rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground truncate">{h.area}</span>
                    <span className="text-xs font-bold font-heading text-foreground tabular-nums">{h.avgResponse}m</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-rb-primary" style={{ width: `${(h.avgResponse / 10) * 100}%` }} />
                  </div>
                  <div className="text-[11px] text-rb-muted mt-1">{h.volume} incidents · dispatch {h.avgDispatch}m</div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function TrendCard({ label, value, delta, up, good }) {
  return (
    <div className="flex items-center justify-between gap-2 glass rounded-xl p-3">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{label}</div>
        <div className="font-heading font-extrabold text-lg text-foreground tabular-nums">{value}</div>
      </div>
      <div className={cn("flex items-center gap-1 text-xs font-bold", good ? "text-rb-operational" : "text-rb-warning")}>
        {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        {delta}
      </div>
    </div>
  );
}