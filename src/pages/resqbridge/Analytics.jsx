import React, { useState } from "react";
import {
  BarChart3, Activity, Ambulance, Hospital, Clock, Send, Navigation,
  CheckCircle2, XCircle, Repeat2, TrendingUp, Gauge, Wrench, Timer, Bed, ArrowDownRight, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, KpiCard } from "@/components/resqbridge/Glass";
import { ChartCard, TrendArea, BarSeries, Donut, MetricCard } from "@/components/resqbridge/Charts";
import { operationsAnalytics, fleetAnalytics, hospitalAnalytics } from "@/lib/resqbridge/mockData";

const tabs = [
  { key: "operations", label: "Operations", icon: Activity },
  { key: "fleet", label: "Fleet", icon: Ambulance },
  { key: "hospital", label: "Hospital", icon: Hospital },
];

export default function Analytics() {
  const [tab, setTab] = useState("operations");
  const [range, setRange] = useState("7 Days");
  const ranges = ["Today", "7 Days", "30 Days", "Custom"];

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div className="flex items-center gap-1 glass-elevated rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn("h-9 px-4 rounded-lg text-sm font-bold font-heading flex items-center gap-2 transition-colors", tab === t.key ? "bg-rb-primary/12 text-rb-primary" : "text-rb-muted hover:text-foreground")}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
          {ranges.map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={cn("h-8 px-3 rounded-lg text-xs font-bold font-heading transition-colors", range === r ? "bg-rb-primary/12 text-rb-primary" : "text-rb-muted hover:text-foreground")}>{r}</button>
          ))}
        </div>
      </div>

      {tab === "operations" && <OperationsAnalytics />}
      {tab === "fleet" && <FleetAnalytics />}
      {tab === "hospital" && <HospitalAnalytics />}
    </div>
  );
}

function OperationsAnalytics() {
  const { totals, averages, trend, statusBreakdown } = operationsAnalytics;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard icon={BarChart3} label="Total" value={totals.total} tone="primary" />
        <KpiCard icon={Activity} label="Active" value={totals.active} tone="info" />
        <KpiCard icon={TrendingUp} label="Critical" value={totals.critical} tone="critical" pulse />
        <KpiCard icon={CheckCircle2} label="Completed" value={totals.completed} tone="operational" />
        <KpiCard icon={XCircle} label="Cancelled" value={totals.cancelled} tone="warning" />
        <KpiCard icon={Repeat2} label="Diverted" value={totals.diverted} tone="warning" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Avg Response" value={`${averages.responseTime}m`} icon={Timer} tone="primary" />
        <MetricCard label="Avg Dispatch" value={`${averages.dispatchTime}m`} icon={Send} tone="info" />
        <MetricCard label="Avg Hospital Arrival" value={`${averages.hospitalArrival}m`} icon={Navigation} tone="operational" />
        <MetricCard label="Avg Handover" value={`${averages.handover}m`} icon={Clock} tone="primary" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2"><ChartCard title="Emergencies & Response Time" icon={TrendingUp}><TrendArea data={trend} xKey="day" yKeys={["emergencies", "response"]} colors={["hsl(var(--rb-primary))", "hsl(var(--rb-cyan))"]} height={260} /></ChartCard></div>
        <ChartCard title="Status Breakdown" icon={Activity}><Donut data={statusBreakdown} height={260} /></ChartCard>
      </div>
    </div>
  );
}

function FleetAnalytics() {
  const { utilization, available, active, avgTripDuration, avgResponse, maintenance, downtime, trend, typeBreakdown } = fleetAnalytics;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard icon={Gauge} label="Utilization" value={`${utilization}%`} tone="primary" />
        <KpiCard icon={CheckCircle2} label="Available" value={`${available}%`} tone="operational" />
        <KpiCard icon={Activity} label="Active" value={`${active}%`} tone="info" />
        <KpiCard icon={Clock} label="Avg Trip" value={`${avgTripDuration}m`} tone="warning" />
        <KpiCard icon={Timer} label="Avg Response" value={`${avgResponse}m`} tone="primary" />
        <KpiCard icon={Wrench} label="Maintenance" value={`${maintenance}%`} tone="warning" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Downtime" value={`${downtime}%`} icon={XCircle} tone="warning" />
        <MetricCard label="Avg Trip Duration" value={`${avgTripDuration}m`} icon={Clock} tone="primary" />
        <MetricCard label="Available Units" value={`${available}%`} icon={CheckCircle2} tone="operational" />
        <MetricCard label="Active Units" value={`${active}%`} icon={Activity} tone="info" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2"><ChartCard title="Utilization & Trips" icon={Gauge}><BarSeries data={trend} xKey="day" yKeys={["utilization", "trips"]} colors={["hsl(var(--rb-primary))", "hsl(var(--rb-cyan))"]} height={260} /></ChartCard></div>
        <ChartCard title="Fleet Type Mix" icon={Ambulance}><Donut data={typeBreakdown} height={260} /></ChartCard>
      </div>
    </div>
  );
}

function HospitalAnalytics() {
  const { avgLoad, incoming, capacityUtilization, avgArrival, avgHandover, diversions, criticalCapacityEvents, loadByHospital, handoverTrend } = hospitalAnalytics;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard icon={Bed} label="Avg Load" value={`${avgLoad}%`} tone="warning" />
        <KpiCard icon={Ambulance} label="Incoming" value={incoming} tone="info" sub="cases" />
        <KpiCard icon={Gauge} label="Capacity Util." value={`${capacityUtilization}%`} tone="primary" />
        <KpiCard icon={Navigation} label="Avg Arrival" value={`${avgArrival}m`} tone="operational" />
        <KpiCard icon={Clock} label="Avg Handover" value={`${avgHandover}m`} tone="primary" />
        <KpiCard icon={Repeat2} label="Diversions" value={diversions} tone="warning" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Critical Capacity Events" value={criticalCapacityEvents} icon={Activity} tone="critical" />
        <MetricCard label="Diversions" value={diversions} icon={Repeat2} tone="warning" />
        <MetricCard label="Avg Handover" value={`${avgHandover}m`} icon={Clock} tone="primary" />
        <MetricCard label="Avg Arrival" value={`${avgArrival}m`} icon={Navigation} tone="operational" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2"><ChartCard title="Arrival & Handover Trends" icon={Clock}><TrendArea data={handoverTrend} xKey="day" yKeys={["arrival", "handover"]} colors={["hsl(var(--rb-primary))", "hsl(var(--rb-operational))"]} height={260} /></ChartCard></div>
        <ChartCard title="Load by Hospital" icon={Hospital}>
          <div className="space-y-2 mt-1">
            {loadByHospital.map((h) => (
              <div key={h.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{h.name}</span>
                  <span className="font-bold font-heading text-foreground tabular-nums">{h.load}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full", h.load >= 90 ? "bg-rb-critical" : h.load >= 70 ? "bg-rb-warning" : "bg-rb-operational")} style={{ width: `${h.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}