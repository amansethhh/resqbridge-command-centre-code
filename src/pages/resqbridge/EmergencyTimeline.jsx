import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Clock, Siren, ArrowLeft, GitBranch, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, DetailGroup } from "@/components/resqbridge/DetailParts";
import { GlassPanel, CommandButton } from "@/components/resqbridge/Glass";
import { PriorityBadge, EmergencyStatusBadge } from "@/components/resqbridge/Badges";
import { emergencies, fullTimelineFor, TIMELINE_STAGES } from "@/lib/resqbridge/mockData";

export default function EmergencyTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const e = emergencies.find((x) => x.id === id);

  if (!e) {
    return (
      <GlassPanel elevated className="p-10 text-center">
        <div className="font-heading font-bold text-foreground">Emergency not found</div>
        <Link to="/emergencies"><CommandButton variant="secondary" size="sm" className="mt-4">Back to queue</CommandButton></Link>
      </GlassPanel>
    );
  }

  const timeline = fullTimelineFor(e.id);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Siren} tone={e.priority === "CRITICAL" ? "critical" : "warning"} title={`Timeline · ${e.id}`}
        badges={<><PriorityBadge priority={e.priority} /><EmergencyStatusBadge status={e.status} /></>}
        subtitle={`${e.type} · ${e.area}`}
        onBack={() => navigate(`/emergencies/${e.id}`)} backLabel="Incident"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <DetailGroup icon={GitBranch} title="Incident Lifecycle">
            <div className="mt-2 relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />
              <div className="space-y-4">
                {timeline.map((t, i) => {
                  const stage = TIMELINE_STAGES.find((s) => t.event.startsWith(s) || s.startsWith(t.event.split(" — ")[0])) || t.event;
                  const done = t.state === "done";
                  const active = t.state === "active";
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center ring-4 ring-card z-10",
                        done ? "bg-rb-operational" : active ? "bg-rb-primary pulse-critical" : "bg-muted"
                      )}>
                        {done ? <Activity className="w-3 h-3 text-white" /> : <Clock className={cn("w-3 h-3", active ? "text-white" : "text-rb-muted")} />}
                      </div>
                      <div className="flex-1 min-w-0 glass rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={cn("text-sm font-heading font-bold", t.state === "pending" ? "text-rb-muted" : "text-foreground")}>{stage}</span>
                          <span className="text-[11px] font-mono text-rb-muted tabular-nums">{t.time}</span>
                        </div>
                        <div className="text-[11px] text-rb-muted mt-1 flex items-center gap-2 flex-wrap">
                          <span>by {t.actor}</span>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                            done ? "bg-rb-operational/12 text-rb-operational" : active ? "bg-rb-primary/12 text-rb-primary" : "bg-muted text-rb-muted"
                          )}>
                            {t.state}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DetailGroup>
        </div>

        <div className="space-y-5">
          <DetailGroup icon={Activity} title="Stage Progress">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-rb-muted">Completed</span>
              <span className="font-bold text-foreground tabular-nums">
                {timeline.filter((t) => t.state === "done").length} / {TIMELINE_STAGES.length}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-rb-operational" style={{ width: `${(timeline.filter((t) => t.state === "done").length / TIMELINE_STAGES.length) * 100}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Stat label="Done" value={timeline.filter((t) => t.state === "done").length} tone="operational" />
              <Stat label="Active" value={timeline.filter((t) => t.state === "active").length} tone="primary" />
              <Stat label="Pending" value={timeline.filter((t) => t.state === "pending").length} tone="muted" />
              <Stat label="Total" value={TIMELINE_STAGES.length} tone="info" />
            </div>
          </DetailGroup>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const tones = { operational: "text-rb-operational", primary: "text-rb-primary", muted: "text-rb-muted", info: "text-rb-info" };
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{label}</div>
      <div className={cn("font-heading font-extrabold text-xl mt-1 tabular-nums", tones[tone])}>{value}</div>
    </div>
  );
}