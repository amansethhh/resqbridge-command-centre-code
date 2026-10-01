import React from "react";
import { Link } from "react-router-dom";
import { Siren, Ambulance, Hospital, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityBadge, EmergencyStatusBadge } from "@/components/resqbridge/Badges";
import { etaLabel } from "@/lib/resqbridge/format";

// Compact emergency row used across Overview + Active Emergencies.
export default function EmergencyRow({ e, showAction = true, className = "" }) {
  return (
    <Link
      to={`/emergencies/${e.id}`}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors",
        className
      )}
    >
      <div
        className={cn(
          "icon-tile rounded-lg w-9 h-9 flex items-center justify-center shrink-0",
          e.priority === "CRITICAL" && "ring-2 ring-rb-critical/30"
        )}
      >
        <Siren
          className={cn(
            "w-4 h-4",
            e.priority === "CRITICAL" ? "text-rb-critical" : e.priority === "HIGH" ? "text-rb-warning" : "text-rb-primary"
          )}
          strokeWidth={2.2}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-sm text-foreground truncate">{e.id}</span>
          <PriorityBadge priority={e.priority} />
        </div>
        <div className="text-xs text-rb-muted truncate mt-0.5">
          {e.type} · {e.area}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-5 shrink-0">
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-foreground whitespace-nowrap">
            <Ambulance className="w-3.5 h-3.5 text-rb-muted shrink-0" />
            {e.ambulance || "—"}
          </div>
          <div className="flex items-center justify-end gap-1.5 text-[11px] text-rb-muted mt-0.5 whitespace-nowrap">
            <Hospital className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[120px]">{e.hospital || "Unassigned"}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-sm font-bold font-heading text-foreground tabular-nums whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-rb-muted shrink-0" />
            {etaLabel(e.eta)}
          </div>
          <EmergencyStatusBadge status={e.status} className="mt-1" />
        </div>
      </div>

      {showAction && (
        <ArrowRight className="w-4 h-4 text-rb-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      )}
    </Link>
  );
}