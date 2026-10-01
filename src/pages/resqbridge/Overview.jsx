import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Siren,
  AlertTriangle,
  Ambulance,
  CheckCircle2,
  Hospital,
  Activity,
  ArrowRight,
  ChevronRight,
  Fuel,
  Bed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, KpiCard, SectionTitle, CommandButton } from "@/components/resqbridge/Glass";
import { PriorityBadge, EmergencyStatusBadge, HospitalStatusBadge, AlertLevelBadge } from "@/components/resqbridge/Badges";
import EmergencyRow from "@/components/resqbridge/EmergencyRow";
import CommandMap from "@/components/resqbridge/CommandMap";
import { emergencies, alerts, ambulances, hospitals, kpis, PRIORITY } from "@/lib/resqbridge/mockData";
import { timeAgo } from "@/lib/resqbridge/format";
import { useCriticalState } from "@/components/resqbridge/CriticalState";

const alertState = (title) => {
  if (title.includes("Hospital capacity")) return "C4";
  if (title.includes("No ambulance")) return "C2";
  if (title.includes("Ambulance delayed")) return "C3";
  if (title.includes("escalated") || title.includes("Escalated")) return "C5";
  if (title.includes("Handover")) return null;
  return "C1";
};

export default function Overview() {
  const [selectedEmergency, setSelectedEmergency] = useState("EMG-2026-0472");
  const { openCriticalState } = useCriticalState();
  const activeEmergencies = emergencies
    .filter((e) => !["COMPLETED", "CANCELLED", "FAILED"].includes(e.status))
    .sort((a, b) => (a.priority === PRIORITY.CRITICAL ? -1 : 1));

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard icon={Siren} label="Active Emergencies" value={kpis.activeEmergencies} tone="primary" sub="across network" />
        <KpiCard icon={AlertTriangle} label="Critical" value={kpis.critical} tone="critical" pulse={kpis.critical > 0} sub="require attention" />
        <KpiCard icon={Ambulance} label="Ambulances Active" value={kpis.ambulancesActive} tone="info" sub="on assignment" />
        <KpiCard icon={CheckCircle2} label="Ambulances Available" value={kpis.ambulancesAvailable} tone="operational" sub="ready to dispatch" />
        <KpiCard icon={Hospital} label="Hospitals Online" value={kpis.hospitalsOnline} tone="operational" sub={`${hospitals.length} in network`} />
        <KpiCard icon={Activity} label="Critical Alerts" value={kpis.criticalAlerts} tone="warning" pulse={kpis.criticalAlerts > 0} sub="unacknowledged" />
      </div>

      {/* Map + side column */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <GlassPanel elevated className="p-4 h-[440px] flex flex-col">
            <SectionTitle
              icon={Activity}
              title="Live Operations Map"
              action={
                <Link to="/maps">
                  <CommandButton variant="ghost" size="sm" icon={ChevronRight}>
                    Full map
                  </CommandButton>
                </Link>
              }
            />
            <div className="mt-3 flex-1">
              <CommandMap
                selectedEmergency={selectedEmergency}
                onSelectEmergency={setSelectedEmergency}
                height="h-full"
              />
            </div>
          </GlassPanel>
        </div>

        {/* Operational alerts */}
        <GlassPanel elevated className="p-4 flex flex-col">
          <SectionTitle
            icon={AlertTriangle}
            title="Operational Alerts"
            action={
              <Link to="/alerts">
                <CommandButton variant="ghost" size="sm" icon={ArrowRight}>
                  All
                </CommandButton>
              </Link>
            }
          />
          <div className="mt-3 space-y-2 overflow-y-auto no-scrollbar flex-1">
            {alerts.slice(0, 5).map((a) => {
              const st = alertState(a.title);
              return (
                <button
                  key={a.id}
                  onClick={() =>
                    st &&
                    openCriticalState(st, {
                      emergencyId: a.entity?.startsWith("EMG") ? a.entity : undefined,
                      hospitalId: a.entity?.startsWith("HSP") ? a.entity : undefined,
                      ambulanceId: a.entity?.startsWith("AMB") ? a.entity : undefined,
                    })
                  }
                  className="w-full text-left glass rounded-xl p-3 hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center justify-between gap-2">
                    <AlertLevelBadge level={a.level} />
                    <span className="text-[10px] text-rb-muted font-mono">{timeAgo(a.time)}</span>
                  </div>
                  <div className="font-heading font-bold text-sm text-foreground mt-1.5">{a.title}</div>
                  <div className="text-xs text-rb-muted mt-0.5">{a.detail}</div>
                </button>
              );
            })}
          </div>
        </GlassPanel>
      </div>

      {/* Active emergencies + fleet/hospital overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <GlassPanel elevated className="p-4 xl:col-span-2">
          <SectionTitle
            icon={Siren}
            title="Active Emergencies"
            action={
              <Link to="/emergencies">
                <CommandButton variant="ghost" size="sm" icon={ArrowRight}>
                  View queue
                </CommandButton>
              </Link>
            }
          />
          <div className="mt-2 divide-y divide-border/60">
            {activeEmergencies.slice(0, 5).map((e) => (
              <EmergencyRow key={e.id} e={e} />
            ))}
          </div>
        </GlassPanel>

        {/* Fleet + hospital snapshot */}
        <div className="space-y-5">
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Ambulance} title="Fleet Snapshot" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["AVAILABLE", "EN_ROUTE", "AT_SCENE", "MAINTENANCE"].map((s) => {
                const count = ambulances.filter((a) => a.status === s).length;
                return (
                  <div key={s} className="glass rounded-xl p-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{s.replace(/_/g, " ")}</div>
                    <div className="font-heading font-extrabold text-xl text-foreground tabular-nums">{count}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-rb-muted">
              <Fuel className="w-3.5 h-3.5" />
              Avg fleet fuel{" "}
              <span className="font-bold text-foreground">
                {Math.round(ambulances.reduce((s, a) => s + a.fuel, 0) / ambulances.length)}%
              </span>
            </div>
          </GlassPanel>

          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Hospital} title="Hospital Capacity" />
            <div className="mt-3 space-y-2">
              {hospitals.slice(0, 4).map((h) => {
                const pct = Math.round((h.ed.used / h.ed.total) * 100);
                return (
                  <Link key={h.id} to="/hospitals" className="block">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">{h.name.replace(" Hospital", "")}</span>
                      <HospitalStatusBadge status={h.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            pct >= 90 ? "bg-rb-critical" : pct >= 70 ? "bg-rb-warning" : "bg-rb-operational"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-rb-muted tabular-nums w-12 text-right">
                        {h.ed.used}/{h.ed.total}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}