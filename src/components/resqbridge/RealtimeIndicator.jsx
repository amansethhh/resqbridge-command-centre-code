import React from "react";
import { cn } from "@/lib/utils";
import { Wifi, RefreshCw, WifiOff, Loader2 } from "lucide-react";
import { REALTIME_STATE } from "@/lib/resqbridge/mockData";

const config = {
  LIVE: { icon: Wifi, label: "LIVE", cls: "text-rb-operational", dot: "bg-rb-operational", ring: "ring-rb-operational/30" },
  CONNECTING: { icon: Loader2, label: "CONNECTING", cls: "text-rb-info", dot: "bg-rb-info", ring: "ring-rb-info/30", spin: true },
  RECONNECTING: { icon: RefreshCw, label: "RECONNECTING", cls: "text-rb-warning", dot: "bg-rb-warning blink", ring: "ring-rb-warning/30", spin: true },
  OFFLINE: { icon: WifiOff, label: "OFFLINE", cls: "text-rb-critical", dot: "bg-rb-critical", ring: "ring-rb-critical/30" },
};

export default function RealtimeIndicator({ state = REALTIME_STATE.LIVE, className = "" }) {
  const c = config[state] || config.LIVE;
  const Icon = c.icon;
  return (
    <div
      className={cn(
        "glass rounded-full h-9 px-3 inline-flex items-center gap-2 ring-1",
        c.ring,
        className
      )}
      title={`Realtime connection: ${c.label}`}
    >
      <Icon className={cn("w-3.5 h-3.5", c.cls, c.spin && "animate-spin")} strokeWidth={2.4} />
      <span className={cn("text-[11px] font-bold tracking-wider font-heading", c.cls)}>{c.label}</span>
    </div>
  );
}