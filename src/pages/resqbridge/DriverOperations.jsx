import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Search, MapPin, Ambulance, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, KpiCard } from "@/components/resqbridge/Glass";
import { DriverStatusBadge } from "@/components/resqbridge/Badges";
import { drivers, DRIVER_STATUS } from "@/lib/resqbridge/mockData";

const statusOptions = ["ALL", ...Object.values(DRIVER_STATUS)];

export default function DriverOperations() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const filtered = drivers.filter((d) => {
    if (status !== "ALL" && d.status !== status) return false;
    if (query) {
      const q = query.toLowerCase();
      return d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q) || (d.ambulance || "").toLowerCase().includes(q);
    }
    return true;
  });

  const available = drivers.filter((d) => d.status === DRIVER_STATUS.AVAILABLE).length;
  const onAssignment = drivers.filter((d) => d.status === DRIVER_STATUS.ON_ASSIGNMENT).length;
  const offline = drivers.filter((d) => [DRIVER_STATUS.OFFLINE, DRIVER_STATUS.GPS_INACTIVE, DRIVER_STATUS.UNAVAILABLE].includes(d.status)).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={User} label="Total Drivers" value={drivers.length} tone="primary" />
        <KpiCard icon={User} label="Available" value={available} tone="operational" />
        <KpiCard icon={User} label="On Assignment" value={onAssignment} tone="info" />
        <KpiCard icon={User} label="Offline" value={offline} tone="warning" />
      </div>

      <GlassPanel elevated className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="glass rounded-xl h-10 flex items-center gap-2 px-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-rb-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by ID, name, ambulance…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-rb-muted/70 text-foreground" />
        </div>
        <div className="glass rounded-xl h-10 flex items-center gap-2 pl-3 pr-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-transparent outline-none text-sm font-semibold text-foreground cursor-pointer pr-1">
            {statusOptions.map((o) => <option key={o} value={o} className="bg-card">{o === "ALL" ? "All" : o}</option>)}
          </select>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <GlassPanel key={d.id} elevated className="p-4 hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rb-primary to-rb-cyan text-white font-heading font-bold flex items-center justify-center shrink-0">
                  {d.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="font-heading font-bold text-foreground truncate">{d.name}</div>
                  <div className="text-xs text-rb-muted font-mono">{d.id}</div>
                </div>
              </div>
              <DriverStatusBadge status={d.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Mini icon={Ambulance} label="Ambulance" value={d.ambulance || "—"} />
              <Mini icon={Radio} label="GPS" value={d.gps} />
              <Mini icon={MapPin} label="Assignment" value={d.assignment || "Standby"} />
              <Mini icon={User} label="Shift" value={d.shift} />
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-lg p-2.5">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rb-muted">
        <Icon className="w-3 h-3" />{label}
      </div>
      <div className="text-xs font-semibold text-foreground mt-0.5 truncate">{value}</div>
    </div>
  );
}