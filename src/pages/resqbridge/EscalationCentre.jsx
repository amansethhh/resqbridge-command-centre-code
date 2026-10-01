import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertOctagon, Search, Check, ArrowUpRight, Send, Repeat2, Activity, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton } from "@/components/resqbridge/Glass";
import { AlertLevelBadge } from "@/components/resqbridge/Badges";
import { escalations, ESCALATION_TYPE, ALERT_LEVEL } from "@/lib/resqbridge/mockData";
import { timeAgo } from "@/lib/resqbridge/format";
import { useCriticalState } from "@/components/resqbridge/CriticalState";

const statusOptions = ["ALL", "OPEN", "ACKNOWLEDGED", "RESOLVED"];
const severityOptions = ["ALL", ...Object.values(ALERT_LEVEL)];

const statusStyle = {
  OPEN: "text-rb-critical bg-rb-critical/12 border-rb-critical/30",
  ACKNOWLEDGED: "text-rb-warning bg-rb-warning/12 border-rb-warning/30",
  RESOLVED: "text-rb-operational bg-rb-operational/12 border-rb-operational/30",
};

export default function EscalationCentre() {
  const navigate = useNavigate();
  const { openCriticalState } = useCriticalState();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [statuses, setStatuses] = useState(() => Object.fromEntries(escalations.map((e) => [e.id, e.status])));

  const filtered = useMemo(() => escalations.filter((e) => {
    if (status !== "ALL" && statuses[e.id] !== status) return false;
    if (severity !== "ALL" && e.severity !== severity) return false;
    if (query) {
      const q = query.toLowerCase();
      return e.type.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q) || e.entity.toLowerCase().includes(q);
    }
    return true;
  }), [query, status, severity, statuses]);

  const openCount = Object.values(statuses).filter((s) => s === "OPEN").length;
  const ackCount = Object.values(statuses).filter((s) => s === "ACKNOWLEDGED").length;

  const resolve = (id) => setStatuses((s) => ({ ...s, [id]: "RESOLVED" }));
  const ack = (id) => setStatuses((s) => ({ ...s, [id]: s[id] === "OPEN" ? "ACKNOWLEDGED" : "OPEN" }));

  const entityRoute = (entity) => {
    if (entity?.startsWith("EMG-")) return `/emergencies/${entity}`;
    if (entity?.startsWith("AMB-")) return `/ambulances/${entity}`;
    if (entity?.startsWith("HSP-")) return `/hospitals/${entity}`;
    if (entity?.startsWith("RB-DRV-")) return `/drivers/${entity}`;
    return null;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-elevated rounded-2xl p-4 flex items-center gap-3"><div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center"><AlertOctagon className="w-5 h-5 text-rb-critical" /></div><div><div className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">Open</div><div className="font-heading font-extrabold text-2xl text-rb-critical tabular-nums">{openCount}</div></div></div>
        <div className="glass-elevated rounded-2xl p-4 flex items-center gap-3"><div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center"><ShieldAlert className="w-5 h-5 text-rb-warning" /></div><div><div className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">Acknowledged</div><div className="font-heading font-extrabold text-2xl text-foreground tabular-nums">{ackCount}</div></div></div>
        <div className="glass-elevated rounded-2xl p-4 flex items-center gap-3"><div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center"><Activity className="w-5 h-5 text-rb-operational" /></div><div><div className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">Resolved</div><div className="font-heading font-extrabold text-2xl text-foreground tabular-nums">{Object.values(statuses).filter(s => s === "RESOLVED").length}</div></div></div>
        <div className="glass-elevated rounded-2xl p-4 flex items-center gap-3"><div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center"><AlertOctagon className="w-5 h-5 text-rb-primary" /></div><div><div className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">Total</div><div className="font-heading font-extrabold text-2xl text-foreground tabular-nums">{escalations.length}</div></div></div>
      </div>

      <GlassPanel elevated className="p-3 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="glass rounded-xl h-10 flex items-center gap-2 px-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-rb-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search escalations…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-rb-muted/70 text-foreground" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Pill label="Status" value={status} options={statusOptions} onChange={setStatus} />
          <Pill label="Severity" value={severity} options={severityOptions} onChange={setSeverity} />
        </div>
      </GlassPanel>

      <GlassPanel elevated className="p-4">
        <SectionTitle icon={AlertOctagon} title="Escalation Centre" action={<span className="text-xs font-semibold text-rb-muted">{filtered.length} incidents</span>} />
        <div className="mt-3 space-y-2">
          {filtered.map((e) => {
            const cur = statuses[e.id];
            const route = entityRoute(e.entity);
            const criticalState = e.type === ESCALATION_TYPE.NO_AMBULANCE ? "C2" : e.type === ESCALATION_TYPE.CRITICAL_CAPACITY ? "C4" : e.type === ESCALATION_TYPE.MAJOR_DELAY ? "C3" : null;
            return (
              <div key={e.id} className={cn("glass rounded-xl p-3 flex flex-col sm:flex-row sm:items-start gap-3", cur === "OPEN" && e.severity === "CRITICAL" && "ring-1 ring-rb-critical/30")}>
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={cn("icon-tile rounded-lg w-9 h-9 flex items-center justify-center shrink-0", e.severity === "CRITICAL" && "ring-2 ring-rb-critical/30")}>
                    <AlertOctagon className={cn("w-4 h-4", e.severity === "CRITICAL" ? "text-rb-critical" : "text-rb-warning")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <AlertLevelBadge level={e.severity} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{e.type}</span>
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", statusStyle[cur])}>{cur}</span>
                      <span className="text-[11px] font-mono text-rb-muted ml-auto">{timeAgo(e.time)}</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground mt-1">{e.detail}</div>
                    <div className="text-[11px] text-rb-muted mt-0.5">Entity: <span className="font-semibold text-foreground">{e.entity}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  {route && <CommandButton variant="secondary" size="sm" icon={Send} onClick={() => navigate(route)}>View</CommandButton>}
                  {criticalState && <CommandButton variant="warning" size="sm" icon={ArrowUpRight} onClick={() => openCriticalState(criticalState, { emergencyId: e.entity.startsWith("EMG") ? e.entity : undefined, hospitalId: e.entity.startsWith("HSP") ? e.entity : undefined, ambulanceId: e.entity.startsWith("AMB") ? e.entity : undefined })}>Escalate</CommandButton>}
                  {e.type === ESCALATION_TYPE.NO_AMBULANCE && <CommandButton variant="primary" size="sm" icon={Repeat2} onClick={() => navigate("/dispatch")}>Assign</CommandButton>}
                  <CommandButton variant="secondary" size="sm" icon={Check} onClick={() => ack(e.id)}>{cur === "OPEN" ? "Ack" : "Reopen"}</CommandButton>
                  <CommandButton variant="primary" size="sm" icon={Check} onClick={() => resolve(e.id)}>Resolve</CommandButton>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-sm text-rb-muted text-center py-10">No escalations match your filters.</div>}
        </div>
      </GlassPanel>
    </div>
  );
}

function Pill({ label, value, options, onChange }) {
  return (
    <div className="glass rounded-xl h-10 flex items-center gap-2 pl-3 pr-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent outline-none text-sm font-semibold text-foreground cursor-pointer pr-1">
        {options.map((o) => <option key={o} value={o} className="bg-card">{o === "ALL" ? "All" : o.replace(/_/g, " ")}</option>)}
      </select>
    </div>
  );
}