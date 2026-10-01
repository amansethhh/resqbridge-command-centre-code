import React from "react";
import { cn } from "@/lib/utils";
import {
  PRIORITY,
  EMERGENCY_STATUS,
  AMBULANCE_STATUS,
  HOSPITAL_STATUS,
  DRIVER_STATUS,
  SYSTEM_STATE,
  ALERT_LEVEL,
} from "@/lib/resqbridge/mockData";

const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider font-heading whitespace-nowrap border";

const dot = (color) => (
  <span className={cn("w-1.5 h-1.5 rounded-full", color)} />
);

// ---- Priority ----
const priorityStyles = {
  CRITICAL: "bg-rb-critical/12 text-rb-critical border-rb-critical/30",
  HIGH: "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
  MEDIUM: "bg-rb-info/12 text-rb-info border-rb-info/30",
  LOW: "bg-muted text-rb-muted border-border",
};
const priorityDot = {
  CRITICAL: "bg-rb-critical blink",
  HIGH: "bg-rb-warning",
  MEDIUM: "bg-rb-info",
  LOW: "bg-rb-muted",
};

export function PriorityBadge({ priority, className = "" }) {
  return (
    <span className={cn(base, priorityStyles[priority] || priorityStyles.LOW, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", priorityDot[priority] || priorityDot.LOW)} />
      {priority}
    </span>
  );
}

// ---- Emergency status ----
const emStyles = {
  CREATED: "bg-muted text-rb-muted border-border",
  TRIAGING: "bg-rb-info/12 text-rb-info border-rb-info/30",
  DISPATCHING: "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
  ASSIGNED: "bg-rb-primary/12 text-rb-primary border-rb-primary/30",
  EN_ROUTE_TO_PATIENT: "bg-rb-primary/12 text-rb-primary border-rb-primary/30",
  AT_SCENE: "bg-rb-cyan/12 text-rb-cyan border-rb-cyan/30",
  PATIENT_PICKED_UP: "bg-rb-cyan/12 text-rb-cyan border-rb-cyan/30",
  EN_ROUTE_TO_HOSPITAL: "bg-rb-primary/12 text-rb-primary border-rb-primary/30",
  AT_HOSPITAL: "bg-rb-operational/12 text-rb-operational border-rb-operational/30",
  HANDOVER: "bg-rb-operational/12 text-rb-operational border-rb-operational/30",
  COMPLETED: "bg-rb-operational/12 text-rb-operational border-rb-operational/30",
  CANCELLED: "bg-muted text-rb-muted border-border line-through",
  DIVERTED: "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
  FAILED: "bg-rb-critical/12 text-rb-critical border-rb-critical/30",
};
const emDot = {
  CREATED: "bg-rb-muted",
  TRIAGING: "bg-rb-info",
  DISPATCHING: "bg-rb-warning blink",
  ASSIGNED: "bg-rb-primary",
  EN_ROUTE_TO_PATIENT: "bg-rb-primary",
  AT_SCENE: "bg-rb-cyan",
  PATIENT_PICKED_UP: "bg-rb-cyan",
  EN_ROUTE_TO_HOSPITAL: "bg-rb-primary",
  AT_HOSPITAL: "bg-rb-operational",
  HANDOVER: "bg-rb-operational",
  COMPLETED: "bg-rb-operational",
  CANCELLED: "bg-rb-muted",
  DIVERTED: "bg-rb-warning",
  FAILED: "bg-rb-critical blink",
};

export function EmergencyStatusBadge({ status, className = "" }) {
  const label = (status || "").replace(/_/g, " ");
  return (
    <span className={cn(base, emStyles[status] || emStyles.CREATED, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", emDot[status] || emDot.CREATED)} />
      {label}
    </span>
  );
}

// ---- Ambulance status ----
const ambStyles = {
  AVAILABLE: "bg-rb-operational/12 text-rb-operational border-rb-operational/30",
  ASSIGNED: "bg-rb-primary/12 text-rb-primary border-rb-primary/30",
  EN_ROUTE: "bg-rb-primary/12 text-rb-primary border-rb-primary/30",
  AT_SCENE: "bg-rb-cyan/12 text-rb-cyan border-rb-cyan/30",
  PATIENT_ONBOARD: "bg-rb-cyan/12 text-rb-cyan border-rb-cyan/30",
  EN_ROUTE_TO_HOSPITAL: "bg-rb-primary/12 text-rb-primary border-rb-primary/30",
  AT_HOSPITAL: "bg-rb-operational/12 text-rb-operational border-rb-operational/30",
  OFFLINE: "bg-muted text-rb-muted border-border",
  MAINTENANCE: "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
};
const ambDot = {
  AVAILABLE: "bg-rb-operational",
  ASSIGNED: "bg-rb-primary",
  EN_ROUTE: "bg-rb-primary",
  AT_SCENE: "bg-rb-cyan",
  PATIENT_ONBOARD: "bg-rb-cyan",
  EN_ROUTE_TO_HOSPITAL: "bg-rb-primary",
  AT_HOSPITAL: "bg-rb-operational",
  OFFLINE: "bg-rb-muted",
  MAINTENANCE: "bg-rb-warning",
};

export function AmbulanceStatusBadge({ status, className = "" }) {
  const label = (status || "").replace(/_/g, " ");
  return (
    <span className={cn(base, ambStyles[status] || ambStyles.OFFLINE, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", ambDot[status] || ambDot.OFFLINE)} />
      {label}
    </span>
  );
}

// ---- Hospital status ----
const hspStyles = {
  OPERATIONAL: "bg-rb-operational/12 text-rb-operational border-rb-operational/30",
  "LIMITED CAPACITY": "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
  "HIGH LOAD": "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
  CRITICAL: "bg-rb-critical/12 text-rb-critical border-rb-critical/30",
  UNAVAILABLE: "bg-muted text-rb-muted border-border",
};
const hspDot = {
  OPERATIONAL: "bg-rb-operational",
  "LIMITED CAPACITY": "bg-rb-warning",
  "HIGH LOAD": "bg-rb-warning",
  CRITICAL: "bg-rb-critical blink",
  UNAVAILABLE: "bg-rb-muted",
};

export function HospitalStatusBadge({ status, className = "" }) {
  return (
    <span className={cn(base, hspStyles[status] || hspStyles.UNAVAILABLE, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", hspDot[status] || hspDot.UNAVAILABLE)} />
      {status}
    </span>
  );
}

// ---- Driver status ----
const drvStyles = {
  AVAILABLE: "bg-rb-operational/12 text-rb-operational border-rb-operational/30",
  "ON ASSIGNMENT": "bg-rb-primary/12 text-rb-primary border-rb-primary/30",
  OFFLINE: "bg-muted text-rb-muted border-border",
  "GPS INACTIVE": "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
  UNAVAILABLE: "bg-rb-critical/12 text-rb-critical border-rb-critical/30",
};

export function DriverStatusBadge({ status, className = "" }) {
  return <span className={cn(base, drvStyles[status] || drvStyles.OFFLINE, className)}>{status}</span>;
}

// ---- System health ----
const sysStyles = {
  OPERATIONAL: "bg-rb-operational/12 text-rb-operational border-rb-operational/30",
  DEGRADED: "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
  DOWN: "bg-rb-critical/12 text-rb-critical border-rb-critical/30",
  RECONNECTING: "bg-rb-info/12 text-rb-info border-rb-info/30",
};
const sysDot = {
  OPERATIONAL: "bg-rb-operational",
  DEGRADED: "bg-rb-warning",
  DOWN: "bg-rb-critical blink",
  RECONNECTING: "bg-rb-info blink",
};

export function SystemHealthBadge({ state, className = "" }) {
  return (
    <span className={cn(base, sysStyles[state] || sysStyles.DOWN, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", sysDot[state] || sysDot.DOWN)} />
      {state}
    </span>
  );
}

// ---- Alert level ----
const alertStyles = {
  INFORMATION: "bg-rb-info/12 text-rb-info border-rb-info/30",
  WARNING: "bg-rb-warning/12 text-rb-warning border-rb-warning/30",
  CRITICAL: "bg-rb-critical/12 text-rb-critical border-rb-critical/30",
};

export function AlertLevelBadge({ level, className = "" }) {
  return <span className={cn(base, alertStyles[level] || alertStyles.INFORMATION, className)}>{level}</span>;
}

export { PRIORITY, EMERGENCY_STATUS, AMBULANCE_STATUS, HOSPITAL_STATUS, DRIVER_STATUS, SYSTEM_STATE, ALERT_LEVEL };