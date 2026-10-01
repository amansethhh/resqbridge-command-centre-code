import React, { useState } from "react";
import { Bell, Check, AlertTriangle, Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton } from "@/components/resqbridge/Glass";
import { AlertLevelBadge } from "@/components/resqbridge/Badges";
import { alerts, ALERT_LEVEL } from "@/lib/resqbridge/mockData";
import { timeAgo } from "@/lib/resqbridge/format";

const levelOptions = ["ALL", ...Object.values(ALERT_LEVEL)];
const ackOptions = ["ALL", "UNACKNOWLEDGED", "ACKNOWLEDGED"];

const levelIcon = { CRITICAL: AlertTriangle, WARNING: AlertTriangle, INFORMATION: Info };

export default function Alerts() {
  const [level, setLevel] = useState("ALL");
  const [ack, setAck] = useState("ALL");
  const [query, setQuery] = useState("");
  const [ackd, setAckd] = useState(() => new Set(alerts.filter((a) => a.ack).map((a) => a.id)));

  const filtered = alerts.filter((a) => {
    if (level !== "ALL" && a.level !== level) return false;
    if (ack === "ACKNOWLEDGED" && !ackd.has(a.id)) return false;
    if (ack === "UNACKNOWLEDGED" && ackd.has(a.id)) return false;
    if (query) {
      const q = query.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q) || a.entity.toLowerCase().includes(q);
    }
    return true;
  });

  const toggle = (id) => setAckd((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  return (
    <div className="space-y-5">
      <GlassPanel elevated className="p-3 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="glass rounded-xl h-10 flex items-center gap-2 px-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-rb-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search alerts…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-rb-muted/70 text-foreground" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Pill label="Level" value={level} options={levelOptions} onChange={setLevel} />
          <Pill label="State" value={ack} options={ackOptions} onChange={setAck} />
        </div>
      </GlassPanel>

      <GlassPanel elevated className="p-4">
        <SectionTitle icon={Bell} title="Operational Alerts" action={<span className="text-xs font-semibold text-rb-muted">{filtered.length} alerts</span>} />
        <div className="mt-3 space-y-2">
          {filtered.map((a) => {
            const Icon = levelIcon[a.level];
            const isAckd = ackd.has(a.id);
            return (
              <div key={a.id} className={cn("glass rounded-xl p-3 flex items-start gap-3", a.level === "CRITICAL" && !isAckd && "ring-1 ring-rb-critical/30")}>
                <div className={cn("icon-tile rounded-lg w-9 h-9 flex items-center justify-center shrink-0", a.level === "CRITICAL" ? "ring-2 ring-rb-critical/30" : "")}>
                  <Icon className={cn("w-4 h-4", a.level === "CRITICAL" ? "text-rb-critical" : a.level === "WARNING" ? "text-rb-warning" : "text-rb-info")} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertLevelBadge level={a.level} />
                    <span className="text-[11px] font-mono text-rb-muted">{timeAgo(a.time)}</span>
                    {isAckd && <span className="text-[10px] font-bold text-rb-operational uppercase tracking-wider">Acknowledged</span>}
                  </div>
                  <div className="font-heading font-bold text-sm text-foreground mt-1">{a.title}</div>
                  <div className="text-xs text-rb-muted mt-0.5">{a.detail}</div>
                  <div className="text-[11px] text-rb-muted mt-1">Entity: <span className="font-semibold text-foreground">{a.entity}</span></div>
                </div>
                <CommandButton variant={isAckd ? "secondary" : "primary"} size="sm" icon={Check} onClick={() => toggle(a.id)}>
                  {isAckd ? "Unack" : "Acknowledge"}
                </CommandButton>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-sm text-rb-muted text-center py-10">No alerts match your filters.</div>}
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