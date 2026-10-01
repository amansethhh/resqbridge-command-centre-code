import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Map, Layers, Crosshair, ArrowRight, Siren, Ambulance, Hospital, Clock, Navigation, Flame, Timer, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton, IconButton } from "@/components/resqbridge/Glass";
import { PriorityBadge, EmergencyStatusBadge, AmbulanceStatusBadge, HospitalStatusBadge } from "@/components/resqbridge/Badges";
import CommandMap from "@/components/resqbridge/CommandMap";
import { emergencies, ambulances, hospitals } from "@/lib/resqbridge/mockData";
import { etaLabel } from "@/lib/resqbridge/format";

const mapTabs = [
  { to: "/maps", label: "Live Operations", icon: Map, end: true },
  { to: "/maps/heatmap", label: "Emergency Heatmap", icon: Flame },
  { to: "/maps/response-time", label: "Response Time", icon: Timer },
  { to: "/maps/geo-ops", label: "Geographic Ops", icon: Globe },
];

export default function LiveMap() {
  const [selectedEmergency, setSelectedEmergency] = useState("EMG-2026-0472");
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [layers, setLayers] = useState({ emergencies: true, ambulances: true, hospitals: true });

  const e = emergencies.find((x) => x.id === selectedEmergency);
  const a = ambulances.find((x) => x.id === selectedAmbulance);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1 glass-elevated rounded-xl p-1 w-fit overflow-x-auto no-scrollbar">
        {mapTabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end}
            className={({ isActive }) => cn(
              "h-9 px-3.5 rounded-lg text-sm font-bold font-heading flex items-center gap-2 whitespace-nowrap transition-colors",
              (t.end ? isActive : isActive) ? "bg-rb-primary/12 text-rb-primary" : "text-rb-muted hover:text-foreground"
            )}>
            <t.icon className="w-4 h-4" />{t.label}
          </NavLink>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Map */}
        <div className="xl:col-span-3">
          <GlassPanel elevated className="p-4 flex flex-col h-[640px]">
            <SectionTitle
              icon={Map}
              title="Live Operations Map"
              action={
                <div className="flex items-center gap-2">
                  <IconButton icon={Layers} label="Layers" />
                  <IconButton icon={Crosshair} label="Focus incident" />
                </div>
              }
            />
            <div className="mt-3 flex-1">
              <CommandMap
                showEmergencies={layers.emergencies}
                showAmbulances={layers.ambulances}
                showHospitals={layers.hospitals}
                selectedEmergency={selectedEmergency}
                onSelectEmergency={setSelectedEmergency}
                selectedAmbulance={selectedAmbulance}
                onSelectAmbulance={setSelectedAmbulance}
                height="h-full"
              />
            </div>
          </GlassPanel>
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Layers} title="Map Layers" />
            <div className="mt-3 space-y-2">
              {[
                { key: "emergencies", label: "Emergencies", icon: Siren, color: "bg-rb-critical" },
                { key: "ambulances", label: "Ambulances", icon: Ambulance, color: "bg-rb-primary" },
                { key: "hospitals", label: "Hospitals", icon: Hospital, color: "bg-rb-operational" },
              ].map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLayers((s) => ({ ...s, [l.key]: !s[l.key] }))}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold transition-colors",
                    layers[l.key] ? "glass text-foreground" : "bg-muted/30 text-rb-muted"
                  )}
                >
                  <span className={cn("w-2.5 h-2.5 rounded-full", layers[l.key] ? l.color : "bg-rb-muted/40")} />
                  <l.icon className="w-4 h-4" />
                  {l.label}
                </button>
              ))}
            </div>
          </GlassPanel>

          {e && (
            <GlassPanel elevated className="p-4">
              <SectionTitle icon={Siren} title="Selected Emergency" />
              <div className="mt-3">
                <Link to={`/emergencies/${e.id}`} className="flex items-center justify-between gap-2">
                  <span className="font-heading font-bold text-sm text-foreground hover:text-rb-primary">{e.id}</span>
                  <ArrowRight className="w-4 h-4 text-rb-muted" />
                </Link>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <PriorityBadge priority={e.priority} />
                  <EmergencyStatusBadge status={e.status} />
                </div>
                <div className="text-xs text-rb-muted mt-2">{e.type} · {e.area}</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <MiniStat icon={Ambulance} label="Ambulance" value={e.ambulance || "—"} />
                  <MiniStat icon={Clock} label="ETA" value={etaLabel(e.eta)} />
                  <MiniStat icon={Navigation} label="Distance" value={e.distance != null ? `${e.distance}km` : "—"} />
                  <MiniStat icon={Hospital} label="Hospital" value={e.hospital || "—"} />
                </div>
              </div>
            </GlassPanel>
          )}

          {a && (
            <GlassPanel elevated className="p-4">
              <SectionTitle icon={Ambulance} title="Selected Ambulance" />
              <div className="mt-3">
                <div className="font-heading font-bold text-sm text-foreground">{a.id}</div>
                <div className="text-xs text-rb-muted">{a.reg} · {a.type}</div>
                <div className="mt-2">
                  <AmbulanceStatusBadge status={a.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <MiniStat icon={Ambulance} label="Driver" value={a.driver || "—"} />
                  <MiniStat icon={Clock} label="ETA" value={etaLabel(a.eta)} />
                </div>
              </div>
            </GlassPanel>
          )}

          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Hospital} title="Hospital Markers" />
            <div className="mt-3 space-y-2">
              {hospitals.map((h) => (
                <div key={h.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground truncate">{h.name.replace(" Hospital", "")}</span>
                  <HospitalStatusBadge status={h.status} />
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-lg p-2">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rb-muted">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-xs font-semibold text-foreground mt-0.5 truncate">{value}</div>
    </div>
  );
}