import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Siren, Ambulance, AlertTriangle, Check, MapPin, Clock, Hospital } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton } from "@/components/resqbridge/Glass";
import { PriorityBadge, EmergencyStatusBadge, AmbulanceStatusBadge } from "@/components/resqbridge/Badges";
import { emergencies, ambulances, hospitals, PRIORITY } from "@/lib/resqbridge/mockData";
import { etaLabel } from "@/lib/resqbridge/format";

export default function Dispatch() {
  const [selected, setSelected] = useState({ emergency: "EMG-2026-0470", ambulance: null });
  const [confirm, setConfirm] = useState(false);

  const unassigned = emergencies.filter((e) => !e.ambulance && !["COMPLETED", "CANCELLED"].includes(e.status));
  const available = ambulances.filter((a) => a.status === "AVAILABLE");
  const active = emergencies.filter((e) => e.ambulance && !["COMPLETED", "CANCELLED"].includes(e.status));

  const selEmergency = emergencies.find((e) => e.id === selected.emergency);
  const selAmbulance = ambulances.find((a) => a.id === selected.ambulance);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Needs dispatch */}
        <GlassPanel elevated className="p-4">
          <SectionTitle icon={Siren} title="Needs Dispatch" action={<span className="text-xs font-bold text-rb-critical">{unassigned.length}</span>} />
          <div className="mt-3 space-y-2">
            {unassigned.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected((s) => ({ ...s, emergency: e.id }))}
                className={cn(
                  "w-full text-left glass rounded-xl p-3 transition-all",
                  selected.emergency === e.id ? "ring-2 ring-rb-primary/50" : "hover:scale-[1.01]"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-bold text-sm text-foreground">{e.id}</span>
                  <PriorityBadge priority={e.priority} />
                </div>
                <div className="text-xs text-rb-muted mt-1">{e.type} · {e.area}</div>
                <div className="mt-2">
                  <EmergencyStatusBadge status={e.status} />
                </div>
              </button>
            ))}
            {unassigned.length === 0 && <Empty text="No emergencies awaiting dispatch" />}
          </div>
        </GlassPanel>

        {/* Available ambulances */}
        <GlassPanel elevated className="p-4">
          <SectionTitle icon={Ambulance} title="Available Ambulances" action={<span className="text-xs font-bold text-rb-operational">{available.length}</span>} />
          <div className="mt-3 space-y-2">
            {available.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected((s) => ({ ...s, ambulance: a.id }))}
                className={cn(
                  "w-full text-left glass rounded-xl p-3 transition-all",
                  selected.ambulance === a.id ? "ring-2 ring-rb-primary/50" : "hover:scale-[1.01]"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-bold text-sm text-foreground">{a.id}</span>
                  <AmbulanceStatusBadge status={a.status} />
                </div>
                <div className="text-xs text-rb-muted mt-1">{a.reg} · {a.type} · Driver {a.driver}</div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-rb-muted">
                  <span>Fuel {a.fuel}%</span>
                  <span>·</span>
                  <span>Battery {a.battery}%</span>
                </div>
              </button>
            ))}
            {available.length === 0 && (
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rb-critical" />
                <span className="text-xs font-semibold text-rb-critical">No suitable ambulance available</span>
              </div>
            )}
          </div>
        </GlassPanel>

        {/* Assignment confirmation */}
        <GlassPanel elevated className="p-4">
          <SectionTitle icon={Send} title="Dispatch Assignment" />
          <div className="mt-3 space-y-3">
            <div className="glass rounded-xl p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Emergency</div>
              <div className="font-heading font-bold text-sm text-foreground mt-1">{selEmergency?.id || "—"}</div>
              <div className="text-xs text-rb-muted">{selEmergency?.type} · {selEmergency?.area}</div>
              {selEmergency && <PriorityBadge priority={selEmergency.priority} className="mt-2" />}
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Selected Ambulance</div>
              <div className="font-heading font-bold text-sm text-foreground mt-1">{selAmbulance?.id || "Select an ambulance"}</div>
              <div className="text-xs text-rb-muted">{selAmbulance ? `${selAmbulance.reg} · ${selAmbulance.type}` : "—"}</div>
            </div>
            <div className="glass rounded-xl p-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted flex items-center gap-1"><MapPin className="w-3 h-3" /> Distance</div>
                <div className="text-sm font-bold text-foreground mt-1">~2.4 km</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted flex items-center gap-1"><Clock className="w-3 h-3" /> Est. ETA</div>
                <div className="text-sm font-bold text-foreground mt-1">~5 min</div>
              </div>
            </div>
            <CommandButton
              icon={Check}
              className="w-full"
              disabled={!selAmbulance}
              onClick={() => setConfirm(true)}
            >
              Confirm Dispatch
            </CommandButton>
            <p className="text-[11px] text-rb-muted text-center">Deliberate confirmation required — no accidental dispatch.</p>
          </div>
        </GlassPanel>
      </div>

      {/* Active dispatches */}
      <GlassPanel elevated className="p-4">
        <SectionTitle icon={Send} title="Active Dispatches" />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {active.map((e) => (
            <Link key={e.id} to={`/emergencies/${e.id}`} className="glass rounded-xl p-3 hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading font-bold text-sm text-foreground">{e.id}</span>
                <PriorityBadge priority={e.priority} />
              </div>
              <div className="text-xs text-rb-muted mt-1">{e.type}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1"><Ambulance className="w-3.5 h-3.5 text-rb-muted" />{e.ambulance}</span>
                <span className="text-xs font-bold font-heading text-foreground">{etaLabel(e.eta)}</span>
              </div>
            </Link>
          ))}
        </div>
      </GlassPanel>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setConfirm(false)}>
          <div className="glass-elevated rounded-2xl p-5 max-w-sm w-full animate-rb-scale-in" onClick={(ev) => ev.stopPropagation()}>
            <h3 className="font-heading font-bold text-lg text-foreground">Confirm Dispatch</h3>
            <p className="text-sm text-rb-muted mt-2">
              Assign <b className="text-foreground">{selAmbulance?.id}</b> to <b className="text-foreground">{selEmergency?.id}</b>. Driver {selAmbulance?.driver} will be notified.
            </p>
            <div className="flex gap-2 mt-5">
              <CommandButton variant="secondary" className="flex-1" onClick={() => setConfirm(false)}>Dismiss</CommandButton>
              <CommandButton icon={Check} className="flex-1" onClick={() => setConfirm(false)}>Confirm Dispatch</CommandButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Empty({ text }) {
  return <div className="text-xs text-rb-muted text-center py-6">{text}</div>;
}