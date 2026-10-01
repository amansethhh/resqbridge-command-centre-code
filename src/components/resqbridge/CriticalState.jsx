import React, { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Siren, Ambulance, Clock, MapPin, Hospital, AlertTriangle, ArrowUpRight,
  Repeat2, XCircle, Navigation, Wifi, WifiOff, RefreshCw, Server, Activity,
  Check, X, Shield, User, Bed, Fuel, Radio, AlertOctagon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandButton } from "@/components/resqbridge/Glass";
import { PriorityBadge, EmergencyStatusBadge, AmbulanceStatusBadge, HospitalStatusBadge, SystemHealthBadge, AlertLevelBadge } from "@/components/resqbridge/Badges";
import { emergencies, ambulances, drivers, hospitals, systemIncidents, REALTIME_STATE } from "@/lib/resqbridge/mockData";
import { timeAgo, clockTime } from "@/lib/resqbridge/format";

const CriticalStateContext = createContext(null);

export function useCriticalState() {
  const ctx = useContext(CriticalStateContext);
  if (!ctx) return { openCriticalState: () => {} };
  return ctx;
}

export function CriticalStateProvider({ children }) {
  const [active, setActive] = useState(null); // { kind, payload }
  const navigate = useNavigate();

  const openCriticalState = useCallback((kind, payload = {}) => {
    setActive({ kind, payload });
  }, []);

  const close = useCallback(() => setActive(null), []);

  return (
    <CriticalStateContext.Provider value={{ openCriticalState }}>
      {children}
      {active && (
        <CriticalStateModal
          kind={active.kind}
          payload={active.payload}
          onClose={close}
          onNavigate={(p) => { navigate(p); close(); }}
        />
      )}
    </CriticalStateContext.Provider>
  );
}

const toneCfg = {
  critical: { ring: "ring-rb-critical/40", text: "text-rb-critical", bg: "bg-rb-critical/10", border: "border-rb-critical/30" },
  warning: { ring: "ring-rb-warning/40", text: "text-rb-warning", bg: "bg-rb-warning/10", border: "border-rb-warning/30" },
  info: { ring: "ring-rb-info/40", text: "text-rb-info", bg: "bg-rb-info/10", border: "border-rb-info/30" },
  operational: { ring: "ring-rb-operational/40", text: "text-rb-operational", bg: "bg-rb-operational/10", border: "border-rb-operational/30" },
};

function Shell({ icon: Icon, tone = "critical", title, kicker, onClose, children, actions }) {
  const t = toneCfg[tone];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-elevated rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar animate-rb-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("flex items-start gap-3 p-5 border-b", t.border)}>
          <div className={cn("icon-tile rounded-xl w-12 h-12 flex items-center justify-center shrink-0 ring-2", t.ring)}>
            <Icon className={cn("w-6 h-6", t.text)} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            {kicker && <div className={cn("text-[10px] font-bold uppercase tracking-[0.18em]", t.text)}>{kicker}</div>}
            <h3 className="font-heading font-extrabold text-lg text-foreground leading-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="icon-tile rounded-lg w-8 h-8 flex items-center justify-center shrink-0 hover:scale-105 transition-transform" aria-label="Close">
            <X className="w-4 h-4 text-rb-muted" />
          </button>
        </div>
        <div className="p-5 space-y-3">{children}</div>
        {actions && <div className="flex flex-wrap gap-2 p-5 pt-0">{actions}</div>}
      </div>
    </div>
  );
}

function Row({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-xs text-rb-muted flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground text-right truncate">{value}</span>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={cn("glass rounded-xl p-3", className)}>{children}</div>;
}

function ActBtn({ icon: Icon, variant = "primary", children, onClick }) {
  return <CommandButton variant={variant} size="sm" icon={Icon} onClick={onClick}>{children}</CommandButton>;
}

function CriticalStateModal({ kind, payload, onClose, onNavigate }) {
  const e = emergencies.find((x) => x.id === payload.emergencyId) || emergencies[0];
  const amb = ambulances.find((a) => a.id === payload.ambulanceId) || (e && ambulances.find((a) => a.id === e.ambulance));
  const drv = drivers.find((d) => d.id === payload.driverId) || (amb && drivers.find((d) => d.id === amb.driver));
  const hsp = hospitals.find((h) => h.id === payload.hospitalId) || hospitals.find((h) => h.name === e?.hospital) || hospitals[0];
  const incident = systemIncidents.find((i) => i.id === payload.incidentId) || systemIncidents[0];

  switch (kind) {
    case "C1": // New Critical Emergency
      return (
        <Shell icon={Siren} tone="critical" kicker="Realtime Alert" title="New Critical Emergency" onClose={onClose}
          actions={<>
            <ActBtn icon={Navigation} onClick={() => onNavigate(`/emergencies/${e.id}`)}>View Incident</ActBtn>
            <ActBtn icon={Check} variant="secondary" onClick={onClose}>Acknowledge</ActBtn>
          </>}>
          <Card>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-heading font-bold text-foreground">{e.id}</span>
              <PriorityBadge priority={e.priority} />
              <EmergencyStatusBadge status={e.status} />
            </div>
            <Row label="Type" value={e.type} icon={Siren} />
            <Row label="Location" value={e.area} icon={MapPin} />
            <Row label="Dispatch state" value={e.status.replace(/_/g, " ")} icon={Radio} />
            {e.ambulance && <Row label="Ambulance" value={e.ambulance} icon={Ambulance} />}
            {e.eta != null && <Row label="ETA" value={`${e.eta} min`} icon={Clock} />}
            <Row label="Timestamp" value={clockTime(e.created)} icon={Clock} />
          </Card>
        </Shell>
      );

    case "C2": // No Ambulance Available
      return (
        <Shell icon={Ambulance} tone="critical" kicker="Dispatch Blocker" title="No Suitable Ambulance Available" onClose={onClose}
          actions={<>
            <ActBtn icon={Navigation} variant="secondary" onClick={() => onNavigate("/ambulances")}>View Fleet</ActBtn>
            <ActBtn icon={ArrowUpRight} variant="warning" onClick={onClose}>Escalate</ActBtn>
            <ActBtn icon={Navigation} onClick={() => onNavigate(`/emergencies/${e.id}`)}>View Incident</ActBtn>
          </>}>
          <Card>
            <Row label="Emergency" value={e.id} icon={Siren} />
            <Row label="Priority" value={e.priority} />
            <Row label="Location" value={e.area} icon={MapPin} />
            <Row label="Required type" value={payload.requiredType || "ALS"} icon={Ambulance} />
            <Row label="Dispatch state" value={e.status.replace(/_/g, " ")} icon={Radio} />
          </Card>
          <Card>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted mb-2">Nearby Fleet Status</div>
            {ambulances.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2 py-1">
                <span className="text-xs font-semibold text-foreground">{a.id} · {a.type}</span>
                <AmbulanceStatusBadge status={a.status} />
              </div>
            ))}
            <div className="text-[11px] text-rb-muted mt-1">No units within acceptable ETA range. Consider BLS fallback or mutual aid.</div>
          </Card>
        </Shell>
      );

    case "C3": // Ambulance Delayed
      const prevEta = payload.prevEta ?? (amb?.eta ? amb.eta - 1 : 3);
      const newEta = payload.newEta ?? amb?.eta ?? 4;
      return (
        <Shell icon={Clock} tone="warning" kicker="ETA Updated" title="Ambulance Delayed" onClose={onClose}
          actions={<>
            <ActBtn icon={Navigation} variant="secondary" onClick={() => onNavigate(`/ambulances/${amb?.id}`)}>View Ambulance</ActBtn>
            <ActBtn icon={Navigation} variant="secondary" onClick={() => onNavigate(`/emergencies/${e.id}`)}>View Incident</ActBtn>
            <ActBtn icon={ArrowUpRight} variant="warning" onClick={onClose}>Escalate</ActBtn>
          </>}>
          <Card>
            <Row label="Ambulance" value={amb?.id || "—"} icon={Ambulance} />
            <Row label="Emergency" value={e.id} icon={Siren} />
            <Row label="Driver" value={drv?.name || "—"} icon={User} />
            <Row label="Previous ETA" value={`${prevEta} min`} icon={Clock} />
            <Row label="Updated ETA" value={`${newEta} min`} icon={Clock} />
            <Row label="Delay duration" value={`+${newEta - prevEta} min`} />
            <Row label="Destination" value={e.hospital || "—"} icon={Hospital} />
          </Card>
        </Shell>
      );

    case "C4": // Hospital Capacity Critical
      const dept = payload.department || "ICU";
      const used = dept === "ICU" ? hsp?.icu.used : dept === "Trauma" ? hsp?.trauma.used : hsp?.ed.used;
      const total = dept === "ICU" ? hsp?.icu.total : dept === "Trauma" ? hsp?.trauma.total : hsp?.ed.total;
      return (
        <Shell icon={Hospital} tone="critical" kicker="Capacity Alert" title="Hospital Capacity Critical" onClose={onClose}
          actions={<>
            <ActBtn icon={Navigation} variant="secondary" onClick={() => onNavigate(`/hospitals/${hsp?.id}`)}>View Hospital</ActBtn>
            <ActBtn icon={Navigation} variant="secondary" onClick={() => onNavigate("/emergencies")}>View Emergencies</ActBtn>
            <ActBtn icon={Repeat2} variant="warning" onClick={onClose}>Review Alternatives</ActBtn>
          </>}>
          <Card>
            <Row label="Hospital" value={hsp?.name || "—"} icon={Hospital} />
            <Row label="Department" value={dept} icon={Bed} />
            <Row label="Current capacity" value={`${used}/${total} (${Math.round((used/total)*100)}%)`} />
            <Row label="Available" value={`${total - used} beds`} icon={Bed} />
            <Row label="Incoming" value={`${hsp?.incoming || 0} cases`} icon={Ambulance} />
          </Card>
          <div className="flex items-center gap-2"><HospitalStatusBadge status={hsp?.status} /></div>
        </Shell>
      );

    case "C5": // Emergency Escalated
      return (
        <Shell icon={ArrowUpRight} tone="warning" kicker="Priority Escalation" title="Emergency Escalated" onClose={onClose}
          actions={<>
            <ActBtn icon={Navigation} onClick={() => onNavigate(`/emergencies/${e.id}`)}>View Incident</ActBtn>
            <ActBtn icon={Check} variant="secondary" onClick={onClose}>Acknowledge</ActBtn>
            <ActBtn icon={Activity} variant="warning" onClick={onClose}>Resolve / Continue</ActBtn>
          </>}>
          <Card>
            <Row label="Emergency" value={e.id} icon={Siren} />
            <Row label="Reason" value={payload.reason || "Priority raised HIGH → CRITICAL by supervisor"} icon={AlertTriangle} />
            <Row label="Escalated by" value={payload.by || "ops.dane"} icon={User} />
            <Row label="Timestamp" value={clockTime(payload.time || e.created)} icon={Clock} />
            <Row label="Current status" value={e.status.replace(/_/g, " ")} icon={Radio} />
          </Card>
          <Card>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted mb-2">Assigned Resources</div>
            <Row label="Ambulance" value={e.ambulance || "Unassigned"} icon={Ambulance} />
            <Row label="Driver" value={e.driver || "—"} icon={User} />
            <Row label="Hospital" value={e.hospital || "Unassigned"} icon={Hospital} />
          </Card>
        </Shell>
      );

    case "C6": // Emergency Reassignment
      return <ReassignmentFlow e={e} amb={amb} drv={drv} hsp={hsp} onClose={onClose} onNavigate={onNavigate} />;

    case "C7": // Emergency Cancelled
      return (
        <Shell icon={XCircle} tone="info" kicker="Cancellation" title="Emergency Cancelled" onClose={onClose}
          actions={<>
            <ActBtn icon={Navigation} variant="secondary" onClick={() => onNavigate(`/emergencies/${e.id}`)}>View Incident</ActBtn>
            <ActBtn icon={Check} onClick={onClose}>Confirmed</ActBtn>
          </>}>
          <Card>
            <Row label="Emergency" value={e.id} icon={Siren} />
            <Row label="Cancellation source" value={payload.source || "Operator"} icon={User} />
            <Row label="Timestamp" value={clockTime(payload.time || new Date().toISOString())} icon={Clock} />
            <Row label="Previous status" value={(payload.prevStatus || e.status).replace(/_/g, " ")} />
            <Row label="Current status" value="CANCELLED" />
            {e.ambulance && <Row label="Assigned ambulance" value={e.ambulance} icon={Ambulance} />}
          </Card>
          <div className="text-[11px] text-rb-muted">Affected queues and map state have been updated. Released resources returned to available pool.</div>
        </Shell>
      );

    case "C8": // Emergency Diverted
      const prevHsp = hospitals.find((h) => h.name === payload.prevHospital) || hospitals[0];
      return (
        <Shell icon={Navigation} tone="warning" kicker="Route Diversion" title="Emergency Diverted" onClose={onClose}
          actions={<>
            <ActBtn icon={Navigation} onClick={() => onNavigate(`/emergencies/${e.id}`)}>View Incident</ActBtn>
            <ActBtn icon={Check} variant="secondary" onClick={onClose}>Acknowledge</ActBtn>
          </>}>
          <Card>
            <Row label="Emergency" value={e.id} icon={Siren} />
            <Row label="Ambulance" value={amb?.id || e.ambulance || "—"} icon={Ambulance} />
            <Row label="Previous hospital" value={payload.prevHospital || prevHsp.name} icon={Hospital} />
            <Row label="New hospital" value={hsp?.name || e.hospital || "—"} icon={Hospital} />
            <Row label="Reason" value={payload.reason || "Destination ICU at capacity"} icon={AlertTriangle} />
            <Row label="Previous ETA" value={`${payload.prevEta ?? 6} min`} icon={Clock} />
            <Row label="New ETA" value={`${payload.newEta ?? 9} min`} icon={Clock} />
            <Row label="Timestamp" value={clockTime(payload.time || new Date().toISOString())} icon={Clock} />
          </Card>
        </Shell>
      );

    case "C9": // System / Realtime Degraded
      const rtState = payload.realtimeState || REALTIME_STATE.RECONNECTING;
      return (
        <Shell icon={rtState === "OFFLINE" ? WifiOff : RefreshCw} tone="warning" kicker="Connectivity" title="Realtime Connection Degraded" onClose={onClose}
          actions={<ActBtn icon={RefreshCw} onClick={onClose}>Retry Connection</ActBtn>}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-rb-muted">Current state:</span>
            <span className={cn("text-xs font-bold uppercase tracking-wider",
              rtState === "OFFLINE" ? "text-rb-critical" : rtState === "RECONNECTING" ? "text-rb-warning" : "text-rb-info")}>
              {rtState}
            </span>
          </div>
          <div className="text-sm text-foreground">Live operational data may be delayed.</div>
          <Card>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted mb-2">Possible states</div>
            {[REALTIME_STATE.CONNECTING, REALTIME_STATE.RECONNECTING, REALTIME_STATE.OFFLINE].map((s) => (
              <div key={s} className="flex items-center gap-2 py-1">
                <span className={cn("w-2 h-2 rounded-full", s === rtState ? "bg-rb-warning" : "bg-muted")} />
                <span className={cn("text-xs font-semibold", s === rtState ? "text-foreground" : "text-rb-muted")}>{s}</span>
              </div>
            ))}
          </Card>
          <div className="text-[11px] text-rb-muted">Stale data is never shown as realtime. The global realtime indicator stays synchronized with this state.</div>
        </Shell>
      );

    case "C10": // System Critical Alert
      return (
        <Shell icon={AlertOctagon} tone="critical" kicker="System-Wide Alert" title="System Critical Alert" onClose={onClose}
          actions={<>
            <ActBtn icon={Activity} variant="secondary" onClick={() => onNavigate("/system")}>View System Health</ActBtn>
            <ActBtn icon={RefreshCw} onClick={onClose}>Reconnect</ActBtn>
          </>}>
          <Card>
            <Row label="Affected service" value={incident?.service || "—"} icon={Server} />
            <Row label="Severity" value={incident?.severity || "CRITICAL"} icon={AlertTriangle} />
            <Row label="Current status" value={incident?.status || "—"} icon={Activity} />
            <Row label="Last known state" value={incident?.lastKnown || "—"} icon={Radio} />
            <Row label="Timestamp" value={clockTime(incident?.time || new Date().toISOString())} icon={Clock} />
            <Row label="Recovery" value={incident?.recovery || "—"} icon={RefreshCw} />
          </Card>
          <div className={cn("glass rounded-xl p-3 flex items-center gap-2 border", toneCfg.critical.border)}>
            <AlertTriangle className="w-4 h-4 text-rb-critical shrink-0" />
            <span className="text-xs text-foreground">Operator intervention recommended. Dispatch may be impacted.</span>
          </div>
        </Shell>
      );

    default:
      return null;
  }
}

function ReassignmentFlow({ e, amb, drv, hsp, onClose, onNavigate }) {
  const [step, setStep] = useState("select");
  const [pick, setPick] = useState({ ambulance: null, hospital: null });
  const alts = ambulances.filter((a) => a.status === "AVAILABLE" || a.id === e.ambulance);
  const altHospitals = hospitals.filter((h) => h.status !== "UNAVAILABLE");

  return (
    <Shell icon={Repeat2} tone="warning" kicker="Deliberate Workflow" title="Emergency Reassignment" onClose={onClose}
      actions={
        step === "select" ? <ActBtn icon={Check} disabled={!pick.ambulance} onClick={() => setStep("confirm")}>Continue</ActBtn>
        : <>
            <ActBtn icon={X} variant="secondary" onClick={() => setStep("select")}>Back</ActBtn>
            <ActBtn icon={Check} variant="danger" onClick={() => { onClose(); }}>Confirm Reassignment</ActBtn>
          </>
      }>
      <Card>
        <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted mb-2">Current Assignment</div>
        <Row label="Ambulance" value={e.ambulance || "Unassigned"} icon={Ambulance} />
        <Row label="Driver" value={e.driver || "—"} icon={User} />
        <Row label="Hospital" value={e.hospital || "Unassigned"} icon={Hospital} />
      </Card>
      {step === "select" ? (
        <>
          <Card>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted mb-2">Available Ambulances</div>
            {alts.map((a) => (
              <button key={a.id} onClick={() => setPick((p) => ({ ...p, ambulance: a.id }))}
                className={cn("w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 mt-1 transition-colors",
                  pick.ambulance === a.id ? "bg-rb-primary/12 ring-1 ring-rb-primary/40" : "hover:bg-muted/40")}>
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground">{a.id} · {a.type}</div>
                  <div className="text-[11px] text-rb-muted">{a.driver} · ETA {a.eta ?? "—"}m</div>
                </div>
                <AmbulanceStatusBadge status={a.status} />
              </button>
            ))}
          </Card>
          <Card>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted mb-2">Alternative Hospitals</div>
            {altHospitals.slice(0, 3).map((h) => (
              <button key={h.id} onClick={() => setPick((p) => ({ ...p, hospital: h.id }))}
                className={cn("w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 mt-1 transition-colors",
                  pick.hospital === h.id ? "bg-rb-primary/12 ring-1 ring-rb-primary/40" : "hover:bg-muted/40")}>
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground">{h.name}</div>
                  <div className="text-[11px] text-rb-muted">ED {h.ed.used}/{h.ed.total} · ETA ~{Math.round((h.coords.x + h.coords.y)/12)}m</div>
                </div>
                <HospitalStatusBadge status={h.status} />
              </button>
            ))}
          </Card>
        </>
      ) : (
        <Card className="border border-rb-warning/30">
          <div className="flex items-center gap-2 text-rb-warning font-bold text-sm mb-2"><AlertTriangle className="w-4 h-4" />Confirm Reassignment</div>
          <div className="text-xs text-rb-muted">Emergency <b className="text-foreground">{e.id}</b> will be reassigned to ambulance <b className="text-foreground">{pick.ambulance}</b>{pick.hospital ? <> and diverted to <b className="text-foreground">{hospitals.find(h=>h.id===pick.hospital)?.name}</b></> : null}. Current resources will be released.</div>
          <div className="text-[11px] text-rb-warning mt-2">This action cannot be undone.</div>
        </Card>
      )}
    </Shell>
  );
}