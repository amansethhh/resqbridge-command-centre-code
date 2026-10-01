import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Ambulance, User, MapPin, Fuel, Battery, Clock, Navigation, Wrench,
  ShieldCheck, Activity, Radio, History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, DetailGroup, DetailField, HistoryList, LinkRow } from "@/components/resqbridge/DetailParts";
import { GlassPanel, CommandButton } from "@/components/resqbridge/Glass";
import { AmbulanceStatusBadge, EmergencyStatusBadge } from "@/components/resqbridge/Badges";
import CommandMap from "@/components/resqbridge/CommandMap";
import { ambulances, drivers, emergencies, ambulanceHistory, ambulanceEquipment, AMBULANCE_STATUS } from "@/lib/resqbridge/mockData";
import { etaLabel, timeAgo } from "@/lib/resqbridge/format";

export default function AmbulanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const a = ambulances.find((x) => x.id === id);

  if (!a) {
    return (
      <GlassPanel elevated className="p-10 text-center">
        <div className="font-heading font-bold text-foreground">Ambulance not found</div>
        <p className="text-sm text-rb-muted mt-1">{id} is not in the fleet.</p>
        <Link to="/ambulances"><CommandButton variant="secondary" size="sm" className="mt-4">Back to fleet</CommandButton></Link>
      </GlassPanel>
    );
  }

  const driver = drivers.find((d) => d.id === a.driver);
  const emergency = emergencies.find((e) => e.id === a.assignment);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Ambulance} tone="primary" title={a.id}
        badges={<AmbulanceStatusBadge status={a.status} />}
        subtitle={`${a.reg} · ${a.type} · ${a.driver || "Unassigned driver"}`}
        onBack={() => navigate("/ambulances")} backLabel="Fleet"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <DetailGroup icon={MapPin} title="Live Location & Route">
            <div className="h-[300px]"><CommandMap selectedAmbulance={a.id} showEmergencies={!!a.assignment} height="h-full" /></div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <Mini icon={Navigation} label="Position" value={`Sector ${a.coords.x},${a.coords.y}`} />
              <Mini icon={Clock} label="ETA" value={etaLabel(a.eta)} />
              <Mini icon={Activity} label="Assignment" value={a.assignment || "Standby"} />
            </div>
          </DetailGroup>

          <DetailGroup icon={Wrench} title="Equipment Status">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ambulanceEquipment.map((eq) => (
                <div key={eq.name} className="glass rounded-xl p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck className={cn("w-4 h-4 shrink-0", eq.status === "OPERATIONAL" ? "text-rb-operational" : "text-rb-warning")} />
                    <span className="text-sm font-semibold text-foreground truncate">{eq.name}</span>
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", eq.status === "OPERATIONAL" ? "text-rb-operational" : "text-rb-warning")}>
                    {eq.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </DetailGroup>

          <DetailGroup icon={History} title="Operational History">
            <HistoryList items={ambulanceHistory(a.id).map((h) => ({ ...h, time: timeAgo(h.time) }))} />
          </DetailGroup>
        </div>

        <div className="space-y-5">
          <DetailGroup icon={Ambulance} title="Vehicle">
            <DetailField label="Ambulance ID" value={a.id} icon={Ambulance} mono />
            <DetailField label="Registration" value={a.reg} icon={Ambulance} mono />
            <DetailField label="Type" value={a.type} icon={Wrench} />
            <DetailField label="Status" value={a.status.replace(/_/g, " ")} icon={Activity} />
            <DetailField label="Driver" value={driver?.name || a.driver || "—"} icon={User} />
            <div className="grid grid-cols-2 gap-3 mt-2">
              <FuelBar icon={Fuel} label="Fuel" value={a.fuel} />
              <FuelBar icon={Battery} label="Battery" value={a.battery} />
            </div>
          </DetailGroup>

          {driver && (
            <LinkRow to={`/drivers/${driver.id}`} icon={User} label="Driver" value={driver.name} sub={`${driver.id} · ${driver.gps} GPS`} />
          )}
          {emergency && (
            <LinkRow to={`/emergencies/${emergency.id}`} icon={Radio} label="Current Emergency" value={emergency.id} sub={`${emergency.type} · ${emergency.area}`} />
          )}
        </div>
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rb-muted"><Icon className="w-3 h-3" />{label}</div>
      <div className="font-heading font-bold text-sm text-foreground mt-1 truncate">{value}</div>
    </div>
  );
}

function FuelBar({ icon: Icon, label, value }) {
  const low = label === "Fuel" ? value < 30 : value < 20;
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rb-muted"><Icon className="w-3 h-3" />{label}</div>
      <div className="text-sm font-bold text-foreground mt-0.5">{value}%</div>
      <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full", low ? "bg-rb-critical" : "bg-rb-operational")} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}