import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Hospital, MapPin, Bed, Activity, Ambulance, History, AlertTriangle, Building2, Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, DetailGroup, DetailField, HistoryList } from "@/components/resqbridge/DetailParts";
import { GlassPanel, CommandButton } from "@/components/resqbridge/Glass";
import { HospitalStatusBadge, EmergencyStatusBadge } from "@/components/resqbridge/Badges";
import CommandMap from "@/components/resqbridge/CommandMap";
import { hospitals, ambulances, emergencies, hospitalActivity, hospitalDepartments } from "@/lib/resqbridge/mockData";
import { timeAgo } from "@/lib/resqbridge/format";

function cap(pct) { return pct >= 90 ? "bg-rb-critical" : pct >= 70 ? "bg-rb-warning" : "bg-rb-operational"; }

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const h = hospitals.find((x) => x.id === id);

  if (!h) {
    return (
      <GlassPanel elevated className="p-10 text-center">
        <div className="font-heading font-bold text-foreground">Hospital not found</div>
        <p className="text-sm text-rb-muted mt-1">{id} is not in the network.</p>
        <Link to="/hospitals"><CommandButton variant="secondary" size="sm" className="mt-4">Back to network</CommandButton></Link>
      </GlassPanel>
    );
  }

  const incoming = ambulances.filter((a) => a.status === "EN_ROUTE_TO_HOSPITAL" || a.status === "AT_HOSPITAL").slice(0, 3);
  const active = emergencies.filter((e) => e.hospital === h.name && !["COMPLETED", "CANCELLED"].includes(e.status));
  const depts = hospitalDepartments.map((d) => ({ ...d, used: h[d.key]?.used ?? d.used ?? 0, total: h[d.key]?.total ?? d.total ?? 0 }));

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Hospital} tone="operational" title={h.name}
        badges={<HospitalStatusBadge status={h.status} />}
        subtitle={`Sector ${h.coords.x},${h.coords.y} · ${h.incoming} incoming`}
        onBack={() => navigate("/hospitals")} backLabel="Network"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <DetailGroup icon={MapPin} title="Location Context">
            <div className="h-[300px]"><CommandMap showEmergencies={false} showAmbulances={false} height="h-full" /></div>
          </DetailGroup>

          <DetailGroup icon={Bed} title="Department Capacity">
            <div className="space-y-3">
              {depts.map((d) => {
                const pct = d.total ? Math.round((d.used / d.total) * 100) : 0;
                return (
                  <div key={d.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-rb-muted" />{d.name}</span>
                      <span className="font-bold font-heading text-foreground tabular-nums">{d.used}/{d.total} <span className="text-rb-muted font-normal">({pct}%)</span></span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full", cap(pct))} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </DetailGroup>

          <DetailGroup icon={History} title="Recent Activity">
            <HistoryList items={hospitalActivity(h.id).map((a) => ({ ...a, time: timeAgo(a.time) }))} />
          </DetailGroup>
        </div>

        <div className="space-y-5">
          <DetailGroup icon={Building2} title="Hospital Identity">
            <DetailField label="Hospital ID" value={h.id} icon={Hospital} mono />
            <DetailField label="Status" value={h.status} icon={Activity} />
            <DetailField label="Incoming" value={`${h.incoming} cases`} icon={Ambulance} />
            <DetailField label="ED Capacity" value={`${h.ed.used}/${h.ed.total}`} icon={Bed} />
          </DetailGroup>

          <DetailGroup icon={Ambulance} title="Incoming Ambulances">
            {incoming.length === 0 ? <div className="text-xs text-rb-muted text-center py-3">No incoming ambulances</div> : (
              <div className="space-y-2">
                {incoming.map((a) => (
                  <Link key={a.id} to={`/ambulances/${a.id}`} className="flex items-center justify-between gap-2 glass rounded-xl p-2.5 hover:scale-[1.01] transition-transform">
                    <span className="text-sm font-semibold text-foreground">{a.id}</span>
                    <span className="text-[11px] text-rb-muted">ETA {a.eta ?? "—"}m</span>
                  </Link>
                ))}
              </div>
            )}
          </DetailGroup>

          <DetailGroup icon={Radio} title="Active Emergencies">
            {active.length === 0 ? <div className="text-xs text-rb-muted text-center py-3">No active emergencies routed here</div> : (
              <div className="space-y-2">
                {active.slice(0, 4).map((e) => (
                  <Link key={e.id} to={`/emergencies/${e.id}`} className="flex items-center justify-between gap-2 glass rounded-xl p-2.5 hover:scale-[1.01] transition-transform">
                    <span className="text-sm font-semibold text-foreground">{e.id}</span>
                    <EmergencyStatusBadge status={e.status} />
                  </Link>
                ))}
              </div>
            )}
          </DetailGroup>
        </div>
      </div>
    </div>
  );
}