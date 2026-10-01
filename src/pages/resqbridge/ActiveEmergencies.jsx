import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Siren, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton, IconButton } from "@/components/resqbridge/Glass";
import { PriorityBadge, EmergencyStatusBadge } from "@/components/resqbridge/Badges";
import EmergencyRow from "@/components/resqbridge/EmergencyRow";
import { emergencies, PRIORITY, EMERGENCY_STATUS } from "@/lib/resqbridge/mockData";
import { timeAgo } from "@/lib/resqbridge/format";

const priorityOptions = ["ALL", ...Object.values(PRIORITY)];
const statusOptions = ["ALL", ...Object.values(EMERGENCY_STATUS)];

export default function ActiveEmergencies() {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const filtered = useMemo(() => {
    return emergencies.filter((e) => {
      if (priority !== "ALL" && e.priority !== priority) return false;
      if (status !== "ALL" && e.status !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          e.id.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.area.toLowerCase().includes(q) ||
          (e.ambulance || "").toLowerCase().includes(q) ||
          (e.hospital || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, priority, status]);

  return (
    <div className="space-y-5">
      {/* Filters bar */}
      <GlassPanel elevated className="p-3 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="glass rounded-xl h-10 flex items-center gap-2 px-3 flex-1 max-w-md">
            <Search className="w-4 h-4 text-rb-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, type, area, ambulance, hospital…"
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-rb-muted/70 text-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-rb-muted hidden sm:block" />
          <FilterSelect label="Priority" value={priority} options={priorityOptions} onChange={setPriority} />
          <FilterSelect label="Status" value={status} options={statusOptions} onChange={setStatus} />
        </div>
      </GlassPanel>

      {/* Queue table */}
      <GlassPanel elevated className="p-4">
        <SectionTitle
          icon={Siren}
          title="Emergency Queue"
          action={
            <span className="text-xs font-semibold text-rb-muted">
              {filtered.length} of {emergencies.length} cases
            </span>
          }
        />

        {/* Desktop header */}
        <div className="hidden lg:grid grid-cols-[1.4fr_0.8fr_1fr_0.9fr_0.7fr_0.9fr] gap-3 px-3 py-2 mt-3 text-[10px] font-bold uppercase tracking-wider text-rb-muted border-b border-border/60">
          <span>Emergency</span>
          <span>Priority</span>
          <span>Ambulance</span>
          <span>Hospital</span>
          <span>ETA</span>
          <span>Status</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-1 divide-y divide-border/60">
            {filtered.map((e) => (
              <EmergencyRow key={e.id} e={e} showAction={false} className="lg:hidden" />
            ))}
            {filtered.map((e) => (
              <DesktopRow key={e.id} e={e} />
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="glass rounded-xl h-10 flex items-center gap-2 pl-3 pr-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm font-semibold text-foreground cursor-pointer pr-1"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-card text-foreground">
            {o === "ALL" ? "All" : o.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </div>
  );
}

function DesktopRow({ e }) {
  return (
    <div className="hidden lg:grid grid-cols-[1.4fr_0.8fr_1fr_0.9fr_0.7fr_0.9fr] gap-3 px-3 py-3 items-center hover:bg-muted/40 rounded-xl transition-colors">
      <div className="min-w-0">
        <Link to={`/emergencies/${e.id}`} className="font-heading font-bold text-sm text-foreground hover:text-rb-primary">
          {e.id}
        </Link>
        <div className="text-xs text-rb-muted truncate">{e.type} · {e.area} · {timeAgo(e.created)}</div>
      </div>
      <PriorityBadge priority={e.priority} />
      <span className="text-sm font-semibold text-foreground truncate">{e.ambulance || "—"}</span>
      <span className="text-sm text-rb-muted truncate">{e.hospital || "Unassigned"}</span>
      <span className="text-sm font-bold font-heading text-foreground tabular-nums">{e.eta != null ? `${e.eta}m` : "—"}</span>
      <EmergencyStatusBadge status={e.status} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="icon-tile rounded-2xl w-14 h-14 flex items-center justify-center">
        <Inbox className="w-6 h-6 text-rb-muted" />
      </div>
      <div className="font-heading font-bold text-foreground mt-3">No emergencies match your filters</div>
      <div className="text-sm text-rb-muted mt-1">Adjust the search or filters to see active cases.</div>
    </div>
  );
}