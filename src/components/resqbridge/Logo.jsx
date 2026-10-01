import React from "react";
import { Shield, Activity } from "lucide-react";

// ResQBridge Command Centre wordmark.
// NOTE: This is a placeholder for the official uploaded Command Centre logo.
// Replace the mark below with the provided logo asset when available.
export default function Logo({ compact = false, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="icon-tile rounded-xl w-10 h-10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-rb-primary" strokeWidth={2.2} />
          <Activity className="w-3.5 h-3.5 text-rb-cyan absolute bottom-1 right-1" strokeWidth={2.6} />
        </div>
        <span className="absolute -inset-0.5 rounded-xl ring-1 ring-rb-primary/20 pointer-events-none" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="font-heading font-extrabold tracking-tight text-[15px] text-foreground">
            ResQ<span className="text-rb-primary">Bridge</span>
          </div>
          <div className="text-[10px] font-semibold tracking-[0.22em] text-rb-muted uppercase mt-1">
            Command Centre
          </div>
        </div>
      )}
    </div>
  );
}