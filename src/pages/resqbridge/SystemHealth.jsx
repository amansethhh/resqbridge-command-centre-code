import React from "react";
import { Activity, Server, Database, Radio, Cpu, HardDrive, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, KpiCard } from "@/components/resqbridge/Glass";
import { SystemHealthBadge } from "@/components/resqbridge/Badges";
import { systemServices, SYSTEM_STATE } from "@/lib/resqbridge/mockData";

const iconMap = {
  "API Gateway": Server,
  "PostgreSQL / PostGIS": Database,
  "Redis Cache": Database,
  "Realtime / WebSocket": Radio,
  "AI Service": Cpu,
  "Object Storage": HardDrive,
};

export default function SystemHealth() {
  const operational = systemServices.filter((s) => s.state === SYSTEM_STATE.OPERATIONAL).length;
  const degraded = systemServices.filter((s) => s.state === SYSTEM_STATE.DEGRADED).length;
  const down = systemServices.filter((s) => s.state === SYSTEM_STATE.DOWN).length;
  const avgLatency = Math.round(systemServices.reduce((s, x) => s + x.latency, 0) / systemServices.length);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={Activity} label="Services" value={systemServices.length} tone="primary" />
        <KpiCard icon={Activity} label="Operational" value={operational} tone="operational" />
        <KpiCard icon={Activity} label="Degraded" value={degraded} tone="warning" pulse={degraded > 0} />
        <KpiCard icon={Activity} label="Avg Latency" value={`${avgLatency}ms`} tone="info" />
      </div>

      <GlassPanel elevated className="p-4">
        <SectionTitle icon={Activity} title="System Services" action={<span className="text-xs text-rb-muted">Last checked just now</span>} />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {systemServices.map((s) => {
            const Icon = iconMap[s.name] || Server;
            return (
              <div key={s.name} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("icon-tile rounded-xl w-10 h-10 flex items-center justify-center shrink-0", s.state !== "OPERATIONAL" && "ring-2 ring-rb-warning/30")}>
                      <Icon className={cn("w-[18px] h-[18px]", s.state === "OPERATIONAL" ? "text-rb-operational" : "text-rb-warning")} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-sm text-foreground truncate">{s.name}</div>
                      <div className="text-[11px] text-rb-muted flex items-center gap-1"><Clock className="w-3 h-3" />{s.latency}ms</div>
                    </div>
                  </div>
                  <SystemHealthBadge state={s.state} />
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>

      <GlassPanel elevated className="p-4">
        <SectionTitle icon={Radio} title="Realtime Connectivity" />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="glass rounded-xl p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">WebSocket</div>
            <div className="font-heading font-bold text-foreground mt-1">Connected</div>
            <div className="text-xs text-rb-operational mt-1">31ms · stable</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Event Throughput</div>
            <div className="font-heading font-bold text-foreground mt-1">128 evt/s</div>
            <div className="text-xs text-rb-muted mt-1">peak 210/s today</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Subscriptions</div>
            <div className="font-heading font-bold text-foreground mt-1">14 active</div>
            <div className="text-xs text-rb-muted mt-1">emergencies, fleet, alerts</div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}