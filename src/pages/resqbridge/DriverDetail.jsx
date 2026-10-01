import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { User, MapPin, Ambulance, Radio, Clock, Activity, History, Navigation, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, DetailGroup, DetailField, HistoryList, LinkRow } from "@/components/resqbridge/DetailParts";
import { GlassPanel, CommandButton } from "@/components/resqbridge/Glass";
import { DriverStatusBadge } from "@/components/resqbridge/Badges";
import CommandMap from "@/components/resqbridge/CommandMap";
import { drivers, ambulances, emergencies, driverHistory } from "@/lib/resqbridge/mockData";
import { timeAgo } from "@/lib/resqbridge/format";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const d = drivers.find((x) => x.id === id);

  if (!d) {
    return (
      <GlassPanel elevated className="p-10 text-center">
        <div className="font-heading font-bold text-foreground">Driver not found</div>
        <p className="text-sm text-rb-muted mt-1">{id} is not on roster.</p>
        <Link to="/drivers"><CommandButton variant="secondary" size="sm" className="mt-4">Back to drivers</CommandButton></Link>
      </GlassPanel>
    );
  }

  const ambulance = ambulances.find((a) => a.id === d.ambulance);
  const emergency = emergencies.find((e) => e.id === d.assignment);
  const initials = d.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={User} tone="primary" title={d.name}
        badges={<DriverStatusBadge status={d.status} />}
        subtitle={`${d.id} · ${d.shift} shift`}
        onBack={() => navigate("/drivers")} backLabel="Drivers"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <DetailGroup icon={MapPin} title="Current Location">
            <div className="h-[300px]"><CommandMap selectedAmbulance={d.ambulance} showEmergencies={!!d.assignment} height="h-full" /></div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <Mini icon={Navigation} label="Position" value={`Sector ${d.coords.x},${d.coords.y}`} />
              <Mini icon={Radio} label="GPS" value={d.gps} />
              <Mini icon={Activity} label="Assignment" value={d.assignment || "Standby"} />
            </div>
          </DetailGroup>

          <DetailGroup icon={History} title="Operational History">
            <HistoryList items={driverHistory(d.id).map((h) => ({ ...h, time: timeAgo(h.time) }))} />
          </DetailGroup>
        </div>

        <div className="space-y-5">
          <DetailGroup icon={User} title="Driver Identity">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rb-primary to-rb-cyan text-white font-heading font-bold text-lg flex items-center justify-center shrink-0">{initials}</div>
              <div className="min-w-0">
                <div className="font-heading font-bold text-foreground truncate">{d.name}</div>
                <div className="text-xs text-rb-muted font-mono">{d.id}</div>
              </div>
            </div>
            <DetailField label="Status" value={d.status} icon={Activity} />
            <DetailField label="GPS state" value={d.gps} icon={Radio} />
            <DetailField label="Shift" value={d.shift} icon={Clock} />
            <DetailField label="Assigned ambulance" value={d.ambulance || "—"} icon={Ambulance} mono />
          </DetailGroup>

          {ambulance && (
            <LinkRow to={`/ambulances/${ambulance.id}`} icon={Ambulance} label="Ambulance" value={ambulance.id} sub={`${ambulance.reg} · ${ambulance.type}`} />
          )}
          {emergency && (
            <LinkRow to={`/emergencies/${emergency.id}`} icon={Activity} label="Current Emergency" value={emergency.id} sub={`${emergency.type} · ${emergency.area}`} />
          )}
          <div className="glass rounded-xl p-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rb-operational shrink-0" />
            <span className="text-[11px] text-rb-muted">Personal contact details are withheld per operator privacy policy.</span>
          </div>
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