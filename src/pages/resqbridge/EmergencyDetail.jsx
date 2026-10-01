import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Siren,
  MapPin,
  Ambulance,
  User,
  Hospital,
  Clock,
  Navigation,
  Send,
  Repeat2,
  ArrowUpRight,
  XCircle,
  Check,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton } from "@/components/resqbridge/Glass";
import { PriorityBadge, EmergencyStatusBadge, AmbulanceStatusBadge } from "@/components/resqbridge/Badges";
import CommandMap from "@/components/resqbridge/CommandMap";
import { emergencies, ambulances, drivers, hospitals, timelineFor } from "@/lib/resqbridge/mockData";
import { timeAgo, clockTime } from "@/lib/resqbridge/format";

export default function EmergencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(null);
  const e = emergencies.find((x) => x.id === id);

  if (!e) {
    return (
      <GlassPanel elevated className="p-10 text-center">
        <div className="font-heading font-bold text-foreground">Emergency not found</div>
        <p className="text-sm text-rb-muted mt-1">Case {id} does not exist or has been archived.</p>
        <Link to="/emergencies">
          <CommandButton variant="secondary" size="sm" className="mt-4" icon={ArrowLeft}>
            Back to queue
          </CommandButton>
        </Link>
      </GlassPanel>
    );
  }

  const ambulance = ambulances.find((a) => a.id === e.ambulance);
  const driver = drivers.find((d) => d.id === e.driver);
  const hospital = hospitals.find((h) => h.name === e.hospital);
  const timeline = timelineFor(e.id);

  const actions = [
    { key: "dispatch", label: "Dispatch", icon: Send, variant: "primary", show: !e.ambulance },
    { key: "reassign", label: "Reassign", icon: Repeat2, variant: "secondary", show: !!e.ambulance },
    { key: "escalate", label: "Escalate", icon: ArrowUpRight, variant: "warning", show: true },
    { key: "redirect", label: "Redirect", icon: Navigation, variant: "secondary", show: !!e.hospital },
    { key: "cancel", label: "Cancel", icon: XCircle, variant: "danger", show: e.status !== "CANCELLED" },
  ].filter((a) => a.show);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <CommandButton variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate("/emergencies")}>
          Back
        </CommandButton>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn("icon-tile rounded-xl w-11 h-11 flex items-center justify-center shrink-0", e.priority === "CRITICAL" && "ring-2 ring-rb-critical/30")}>
            <Siren className={cn("w-5 h-5", e.priority === "CRITICAL" ? "text-rb-critical" : "text-rb-warning")} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading font-extrabold text-xl text-foreground">{e.id}</h1>
              <PriorityBadge priority={e.priority} />
              <EmergencyStatusBadge status={e.status} />
            </div>
            <div className="text-sm text-rb-muted mt-0.5">{e.type} · {e.area} · Created {timeAgo(e.created)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: map + entity relationship */}
        <div className="xl:col-span-2 space-y-5">
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={MapPin} title="Live Location & Route" />
            <div className="mt-3 h-[300px]">
              <CommandMap selectedEmergency={e.id} showAmbulances={!!e.ambulance} height="h-full" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <InfoTile label="Distance" value={e.distance != null ? `${e.distance} km` : "—"} icon={Navigation} />
              <InfoTile label="ETA" value={e.eta != null ? `${e.eta} min` : "—"} icon={Clock} />
              <InfoTile label="Area" value={e.area} icon={MapPin} />
            </div>
          </GlassPanel>

          {/* Entity relationship chain */}
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Activity} title="Entity Relationship" />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-stretch gap-2">
              <EntityCard icon={Siren} title="Emergency" value={e.id} sub={e.type} tone="critical" to={`/emergencies/${e.id}`} />
              <ChainLink />
              <EntityCard icon={Ambulance} title="Ambulance" value={e.ambulance || "Unassigned"} sub={ambulance?.type || "—"} tone="primary" />
              <ChainLink />
              <EntityCard icon={User} title="Driver" value={e.driver || "—"} sub={driver?.name || "—"} tone="info" />
              <ChainLink />
              <EntityCard icon={Hospital} title="Hospital" value={e.hospital || "Unassigned"} sub={hospital?.status || "—"} tone="operational" />
            </div>
          </GlassPanel>

          {/* Timeline */}
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Clock} title="Incident Timeline" />
            <div className="mt-4 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-3">
                {timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "w-3.5 h-3.5 rounded-full mt-1 shrink-0 ring-4 ring-card",
                        t.state === "done" ? "bg-rb-operational" : t.state === "active" ? "bg-rb-primary pulse-critical" : "bg-muted"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-sm font-semibold", t.state === "pending" ? "text-rb-muted" : "text-foreground")}>
                          {t.event}
                        </span>
                        <span className="text-[11px] font-mono text-rb-muted tabular-nums">{t.time}</span>
                      </div>
                      <div className="text-[11px] text-rb-muted">by {t.actor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Right: case info + actions */}
        <div className="space-y-5">
          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Siren} title="Case Information" />
            <div className="mt-3 space-y-2.5">
              <Field label="Emergency ID" value={e.id} />
              <Field label="Type" value={e.type} />
              <Field label="Priority" value={e.priority} />
              <Field label="Status" value={e.status.replace(/_/g, " ")} />
              <Field label="Citizen ref" value={e.citizen} />
              <Field label="Created" value={clockTime(e.created)} />
            </div>
          </GlassPanel>

          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Ambulance} title="Assigned Resources" />
            <div className="mt-3 space-y-2.5">
              <ResourceRow icon={Ambulance} label="Ambulance" value={e.ambulance} sub={ambulance?.reg} />
              <ResourceRow icon={User} label="Driver" value={e.driver} sub={driver?.name} />
              <ResourceRow icon={Hospital} label="Hospital" value={e.hospital} sub={hospital ? `${hospital.ed.used}/${hospital.ed.total} ED` : "—"} />
              {ambulance && (
                <div className="pt-2">
                  <AmbulanceStatusBadge status={ambulance.status} />
                </div>
              )}
            </div>
          </GlassPanel>

          <GlassPanel elevated className="p-4">
            <SectionTitle icon={Send} title="Operator Actions" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {actions.map((a) => (
                <CommandButton
                  key={a.key}
                  variant={a.variant}
                  size="sm"
                  icon={a.icon}
                  className="w-full"
                  onClick={() => setConfirm(a.key)}
                >
                  {a.label}
                </CommandButton>
              ))}
            </div>
            <p className="text-[11px] text-rb-muted mt-3">
              Critical actions require deliberate confirmation. Role-based permissions enforced server-side.
            </p>
          </GlassPanel>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirm && (
        <ConfirmModal action={confirm} onClose={() => setConfirm(null)} onConfirm={() => setConfirm(null)} />
      )}
    </div>
  );
}

function InfoTile({ label, value, icon: Icon }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rb-muted">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="font-heading font-bold text-sm text-foreground mt-1 truncate">{value}</div>
    </div>
  );
}

function EntityCard({ icon: Icon, title, value, sub, tone, to }) {
  const tones = { critical: "text-rb-critical", primary: "text-rb-primary", info: "text-rb-info", operational: "text-rb-operational" };
  const content = (
    <div className="glass rounded-xl p-3 flex-1 min-w-0 hover:scale-[1.02] transition-transform">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rb-muted">
        <Icon className={cn("w-3 h-3", tones[tone])} />
        {title}
      </div>
      <div className="font-heading font-bold text-sm text-foreground mt-1 truncate">{value}</div>
      <div className="text-[11px] text-rb-muted truncate">{sub}</div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function ChainLink() {
  return (
    <div className="hidden sm:flex items-center justify-center px-0.5">
      <div className="w-5 h-px bg-border" />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-rb-muted">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right truncate">{value}</span>
    </div>
  );
}

function ResourceRow({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-3">
      <div className="icon-tile rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-rb-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{label}</div>
        <div className="text-sm font-semibold text-foreground truncate">{value || "Unassigned"}</div>
      </div>
      <div className="text-[11px] text-rb-muted">{sub || "—"}</div>
    </div>
  );
}

function ConfirmModal({ action, onClose, onConfirm }) {
  const labels = {
    dispatch: { title: "Confirm Dispatch", body: "Assign the nearest suitable ambulance to this emergency?", cta: "Confirm Dispatch" },
    reassign: { title: "Confirm Reassignment", body: "Reassign this emergency to a different ambulance. The current ambulance will be released.", cta: "Reassign" },
    escalate: { title: "Confirm Escalation", body: "Escalate this emergency to a higher priority and notify supervisors.", cta: "Escalate" },
    redirect: { title: "Confirm Redirect", body: "Redirect this emergency to a different destination hospital.", cta: "Redirect" },
    cancel: { title: "Confirm Cancellation", body: "Cancel this emergency. This will release all assigned resources.", cta: "Cancel Emergency" },
  };
  const l = labels[action] || labels.dispatch;
  const danger = action === "cancel";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-elevated rounded-2xl p-5 max-w-sm w-full animate-rb-scale-in" onClick={(ev) => ev.stopPropagation()}>
        <h3 className="font-heading font-bold text-lg text-foreground">{l.title}</h3>
        <p className="text-sm text-rb-muted mt-2">{l.body}</p>
        <div className="flex gap-2 mt-5">
          <CommandButton variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Dismiss
          </CommandButton>
          <CommandButton variant={danger ? "danger" : "primary"} size="md" className="flex-1" icon={Check} onClick={onConfirm}>
            {l.cta}
          </CommandButton>
        </div>
      </div>
    </div>
  );
}