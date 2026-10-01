import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Ambulance, Fuel, Battery, User, MapPin, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, KpiCard } from "@/components/resqbridge/Glass";
import { AmbulanceStatusBadge } from "@/components/resqbridge/Badges";
import { ambulances, AMBULANCE_STATUS } from "@/lib/resqbridge/mockData";
import { etaLabel } from "@/lib/resqbridge/format";

const statusOptions = ["ALL", ...Object.values(AMBULANCE_STATUS)];

export default function AmbulanceFleet() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const filtered = ambulances.filter((a) => {
    if (status !== "ALL" && a.status !== status) return false;
    if (query) {
      const q = query.toLowerCase();
      return a.id.toLowerCase().includes(q) || a.reg.toLowerCase().includes(q) || (a.driver || "").toLowerCase().includes(q);
    }
    return true;
  });

  const active = ambulances.filter((a) => !["AVAILABLE", "OFFLINE", "MAINTENANCE"].includes(a.status)).length;
  const available = ambulances.filter((a) => a.status === "AVAILABLE").length;
  const offline = ambulances.filter((a) => ["OFFLINE", "MAINTENANCE"].includes(a.status)).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={Ambulance} label="Total Fleet" value={ambulances.length} tone="primary" />
        <KpiCard icon={Ambulance} label="Active" value={active} tone="info" sub="on assignment" />
        <KpiCard icon={Ambulance} label="Available" value={available} tone="operational" sub="ready" />
        <KpiCard icon={Ambulance} label="Offline" value={offline} tone="warning" sub="maintenance / off" />
      </div>

      <GlassPanel elevated className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="glass rounded-xl h-10 flex items-center gap-2 px-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-rb-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by ID, registration, driver…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-rb-muted/70 text-foreground" />
        </div>
        <div className="glass rounded-xl h-10 flex items-center gap-2 pl-3 pr-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-transparent outline-none text-sm font-semibold text-foreground cursor-pointer pr-1">
            {statusOptions.map((o) => <option key={o} value={o} className="bg-card">{o === "ALL" ? "All" : o.replace(/_/g, " ")}</option>)}
          </select>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <GlassPanel key={a.id} elevated className="p-4 hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="icon-tile rounded-xl w-11 h-11 flex items-center justify-center">
                  <Ambulance className="w-5 h-5 text-rb-primary" />
                </div>
                <div>
                  <div className="font-heading font-bold text-foreground">{a.id}</div>
                  <div className="text-xs text-rb-muted">{a.reg} · {a.type}</div>
                </div>
              </div>
              <AmbulanceStatusBadge status={a.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Stat icon={User} label="Driver" value={a.driver || "—"} />
              <Stat icon={Clock} label="ETA" value={etaLabel(a.eta)} />
              <Stat icon={Fuel} label="Fuel" value={`${a.fuel}%`} bar={a.fuel} barTone={a.fuel < 30 ? "critical" : "operational"} />
              <Stat icon={Battery} label="Battery" value={`${a.battery}%`} bar={a.battery} barTone={a.battery < 20 ? "critical" : "operational"} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
              <span className="text-xs text-rb-muted flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{a.assignment ? `Assigned ${a.assignment}` : "Standby"}</span>
              <Link to="/maps" className="text-xs font-bold text-rb-primary hover:underline">Locate →</Link>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, bar, barTone }) {
  return (
    <div className="glass rounded-lg p-2.5">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rb-muted">
        <Icon className="w-3 h-3" />{label}
      </div>
      <div className="text-sm font-bold text-foreground mt-0.5">{value}</div>
      {bar != null && (
        <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
          <div className={cn("h-full rounded-full", barTone === "critical" ? "bg-rb-critical" : "bg-rb-operational")} style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}