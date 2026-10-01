import React from "react";
import { cn } from "@/lib/utils";
import { Siren, Ambulance, Hospital, MapPin } from "lucide-react";
import { emergencies, ambulances, hospitals, PRIORITY } from "@/lib/resqbridge/mockData";

// Mock operations map — stylized representation designed for future
// real map SDK integration. Markers are positioned by {x,y} percentages.
const layerConfig = {
  emergency: { icon: Siren, color: "text-white", bg: "bg-rb-critical", ring: "ring-rb-critical/40" },
  ambulance: { icon: Ambulance, color: "text-white", bg: "bg-rb-primary", ring: "ring-rb-primary/40" },
  hospital: { icon: Hospital, color: "text-white", bg: "bg-rb-operational", ring: "ring-rb-operational/40" },
};

function Marker({ x, y, type, label, selected, onClick, pulse }) {
  const c = layerConfig[type];
  const Icon = c.icon;
  return (
    <button
      onClick={onClick}
      style={{ left: `${x}%`, top: `${y}%` }}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-110 hover:z-20",
        selected && "z-20 scale-110"
      )}
      title={label}
    >
      <span
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded-full ring-2 shadow-lg",
          c.bg,
          c.ring,
          selected && "ring-4",
          pulse && "pulse-critical"
        )}
      >
        <Icon className={cn("w-3.5 h-3.5", c.color)} strokeWidth={2.4} />
      </span>
      {selected && (
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-7 whitespace-nowrap text-[10px] font-bold font-heading glass px-2 py-0.5 rounded-md text-foreground">
          {label}
        </span>
      )}
    </button>
  );
}

export default function CommandMap({
  showEmergencies = true,
  showAmbulances = true,
  showHospitals = true,
  selectedEmergency,
  onSelectEmergency,
  selectedAmbulance,
  onSelectAmbulance,
  className = "",
  height = "h-full",
}) {
  return (
    <div className={cn("relative w-full rounded-2xl glass overflow-hidden", height, className)}>
      {/* Map backdrop */}
      <div className="absolute inset-0 grid-faint opacity-60" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 50% at 45% 40%, hsl(var(--rb-primary)/0.08), transparent 60%), radial-gradient(50% 40% at 75% 70%, hsl(var(--rb-cyan)/0.07), transparent 60%)",
        }}
      />
      {/* Faux waterways / roads */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <path d="M0,120 Q300,80 600,140 T1200,100" stroke="hsl(var(--rb-cyan)/0.25)" strokeWidth="14" fill="none" />
        <path d="M0,260 L1200,240" stroke="hsl(var(--rb-glass-border))" strokeWidth="2" fill="none" />
        <path d="M420,0 L440,500" stroke="hsl(var(--rb-glass-border))" strokeWidth="2" fill="none" />
        <path d="M780,0 L760,500" stroke="hsl(var(--rb-glass-border))" strokeWidth="2" fill="none" />
      </svg>

      {/* Layer toggles */}
      <div className="absolute top-3 left-3 glass rounded-xl px-1 py-1 flex items-center gap-1 z-10">
        {[
          { key: "E", label: "Emergencies", color: "bg-rb-critical" },
          { key: "A", label: "Ambulances", color: "bg-rb-primary" },
          { key: "H", label: "Hospitals", color: "bg-rb-operational" },
        ].map((l) => (
          <span key={l.key} className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold font-heading text-rb-muted">
            <span className={cn("w-2 h-2 rounded-full", l.color)} />
            {l.label}
          </span>
        ))}
      </div>

      <div className="absolute top-3 right-3 glass rounded-xl px-2.5 py-1.5 z-10 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-rb-muted" />
        <span className="text-[10px] font-bold font-heading text-rb-muted">METRO GRID · LIVE</span>
      </div>

      {/* Markers */}
      <div className="absolute inset-0">
        {showHospitals &&
          hospitals.map((h) => (
            <Marker
              key={h.id}
              x={h.coords.x}
              y={h.coords.y}
              type="hospital"
              label={h.name}
              selected={selectedAmbulance === h.id}
            />
          ))}
        {showAmbulances &&
          ambulances
            .filter((a) => a.status !== "OFFLINE" && a.status !== "MAINTENANCE")
            .map((a) => (
              <Marker
                key={a.id}
                x={a.coords.x}
                y={a.coords.y}
                type="ambulance"
                label={a.id}
                selected={selectedAmbulance === a.id}
                onClick={() => onSelectAmbulance?.(a.id)}
              />
            ))}
        {showEmergencies &&
          emergencies
            .filter((e) => !["COMPLETED", "CANCELLED"].includes(e.status))
            .map((e) => (
              <Marker
                key={e.id}
                x={e.coords.x}
                y={e.coords.y}
                type="emergency"
                label={e.id}
                selected={selectedEmergency === e.id}
                pulse={e.priority === PRIORITY.CRITICAL}
                onClick={() => onSelectEmergency?.(e.id)}
              />
            ))}
      </div>

      {/* Scale */}
      <div className="absolute bottom-3 left-3 glass rounded-lg px-2 py-1 flex items-center gap-2 z-10">
        <div className="w-12 h-1 bg-rb-muted/40 rounded" />
        <span className="text-[10px] font-bold font-heading text-rb-muted">2 km</span>
      </div>
    </div>
  );
}