import React, { useState, useMemo } from "react";
import { Bell, Search, Check, CheckCheck, Siren, Ambulance, Hospital, Send, Server, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton } from "@/components/resqbridge/Glass";
import { AlertLevelBadge } from "@/components/resqbridge/Badges";
import { notifications, NOTIF_TYPE, ALERT_LEVEL } from "@/lib/resqbridge/mockData";
import { timeAgo } from "@/lib/resqbridge/format";
import { useNavigate } from "react-router-dom";

const typeIcon = {
  [NOTIF_TYPE.EMERGENCY]: Siren,
  [NOTIF_TYPE.AMBULANCE]: Ambulance,
  [NOTIF_TYPE.HOSPITAL]: Hospital,
  [NOTIF_TYPE.DISPATCH]: Send,
  [NOTIF_TYPE.SYSTEM]: Server,
  [NOTIF_TYPE.REALTIME]: Radio,
};

const typeOptions = ["ALL", ...Object.values(NOTIF_TYPE)];
const severityOptions = ["ALL", ...Object.values(ALERT_LEVEL)];
const readOptions = ["ALL", "UNREAD", "READ"];

const entityRoute = (type, entity) => {
  if (entity?.startsWith("EMG-")) return `/emergencies/${entity}`;
  if (entity?.startsWith("AMB-")) return `/ambulances/${entity}`;
  if (entity?.startsWith("HSP-")) return `/hospitals/${entity}`;
  if (entity?.startsWith("RB-DRV-")) return `/drivers/${entity}`;
  return null;
};

export default function Notifications() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [read, setRead] = useState("ALL");
  const [readIds, setReadIds] = useState(() => new Set(notifications.filter((n) => n.read).map((n) => n.id)));

  const filtered = useMemo(() => notifications.filter((n) => {
    if (type !== "ALL" && n.type !== type) return false;
    if (severity !== "ALL" && n.severity !== severity) return false;
    if (read === "READ" && !readIds.has(n.id)) return false;
    if (read === "UNREAD" && readIds.has(n.id)) return false;
    if (query) {
      const q = query.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.detail.toLowerCase().includes(q) || n.entity.toLowerCase().includes(q);
    }
    return true;
  }), [query, type, severity, read, readIds]);

  const unreadCount = notifications.length - readIds.size;
  const toggle = (id) => setReadIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const markAll = () => setReadIds(new Set(notifications.map((n) => n.id)));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-elevated rounded-2xl p-4 flex items-center gap-3"><div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center"><Bell className="w-5 h-5 text-rb-primary" /></div><div><div className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">Total</div><div className="font-heading font-extrabold text-2xl text-foreground tabular-nums">{notifications.length}</div></div></div>
        <div className="glass-elevated rounded-2xl p-4 flex items-center gap-3"><div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center"><Bell className="w-5 h-5 text-rb-critical" /></div><div><div className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">Unread</div><div className="font-heading font-extrabold text-2xl text-rb-critical tabular-nums">{unreadCount}</div></div></div>
        <div className="glass-elevated rounded-2xl p-4 flex items-center gap-3"><div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center"><Siren className="w-5 h-5 text-rb-warning" /></div><div><div className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">Critical</div><div className="font-heading font-extrabold text-2xl text-foreground tabular-nums">{notifications.filter(n => n.severity === ALERT_LEVEL.CRITICAL).length}</div></div></div>
        <button onClick={markAll} className="glass-elevated rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left"><div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center"><CheckCheck className="w-5 h-5 text-rb-operational" /></div><div><div className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">Mark all</div><div className="font-heading font-bold text-sm text-foreground">Read</div></div></button>
      </div>

      <GlassPanel elevated className="p-3 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="glass rounded-xl h-10 flex items-center gap-2 px-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-rb-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notifications…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-rb-muted/70 text-foreground" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Pill label="Type" value={type} options={typeOptions} onChange={setType} />
          <Pill label="Severity" value={severity} options={severityOptions} onChange={setSeverity} />
          <Pill label="State" value={read} options={readOptions} onChange={setRead} />
        </div>
      </GlassPanel>

      <GlassPanel elevated className="p-4">
        <SectionTitle icon={Bell} title="All Notifications" action={<span className="text-xs font-semibold text-rb-muted">{filtered.length} shown</span>} />
        <div className="mt-3 space-y-2">
          {filtered.map((n) => {
            const Icon = typeIcon[n.type];
            const isRead = readIds.has(n.id);
            const route = entityRoute(n.type, n.entity);
            return (
              <div key={n.id} className={cn("glass rounded-xl p-3 flex items-start gap-3", !isRead && n.severity === "CRITICAL" && "ring-1 ring-rb-critical/30")}>
                <div className={cn("icon-tile rounded-lg w-9 h-9 flex items-center justify-center shrink-0", n.severity === "CRITICAL" ? "ring-2 ring-rb-critical/30" : "")}>
                  <Icon className={cn("w-4 h-4", n.severity === "CRITICAL" ? "text-rb-critical" : n.severity === "WARNING" ? "text-rb-warning" : "text-rb-info")} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertLevelBadge level={n.severity} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{n.type}</span>
                    {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-rb-primary" />}
                    <span className="text-[11px] font-mono text-rb-muted ml-auto">{timeAgo(n.time)}</span>
                  </div>
                  <div className="font-heading font-bold text-sm text-foreground mt-1">{n.title}</div>
                  <div className="text-xs text-rb-muted mt-0.5">{n.detail}</div>
                  <div className="text-[11px] text-rb-muted mt-1">Related: <span className="font-semibold text-foreground">{n.entity}</span></div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {route && <CommandButton variant="secondary" size="sm" onClick={() => navigate(route)}>Open</CommandButton>}
                  <CommandButton variant={isRead ? "ghost" : "primary"} size="sm" icon={Check} onClick={() => toggle(n.id)}>{isRead ? "Unread" : "Read"}</CommandButton>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-sm text-rb-muted text-center py-10">No notifications match your filters.</div>}
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