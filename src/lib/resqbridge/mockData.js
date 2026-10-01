// ResQBridge Command Centre — synthetic mock data layer.
// All data is fictional. No real patient information is used.
// This module is the single source of mock data so the presentation layer
// can later be swapped to a real API service without rewriting components.

export const PRIORITY = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
};

export const EMERGENCY_STATUS = {
  CREATED: "CREATED",
  TRIAGING: "TRIAGING",
  DISPATCHING: "DISPATCHING",
  ASSIGNED: "ASSIGNED",
  EN_ROUTE_TO_PATIENT: "EN_ROUTE_TO_PATIENT",
  AT_SCENE: "AT_SCENE",
  PATIENT_PICKED_UP: "PATIENT_PICKED_UP",
  EN_ROUTE_TO_HOSPITAL: "EN_ROUTE_TO_HOSPITAL",
  AT_HOSPITAL: "AT_HOSPITAL",
  HANDOVER: "HANDOVER",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  DIVERTED: "DIVERTED",
  FAILED: "FAILED",
};

export const AMBULANCE_STATUS = {
  AVAILABLE: "AVAILABLE",
  ASSIGNED: "ASSIGNED",
  EN_ROUTE: "EN_ROUTE",
  AT_SCENE: "AT_SCENE",
  PATIENT_ONBOARD: "PATIENT_ONBOARD",
  EN_ROUTE_TO_HOSPITAL: "EN_ROUTE_TO_HOSPITAL",
  AT_HOSPITAL: "AT_HOSPITAL",
  OFFLINE: "OFFLINE",
  MAINTENANCE: "MAINTENANCE",
};

export const HOSPITAL_STATUS = {
  OPERATIONAL: "OPERATIONAL",
  LIMITED_CAPACITY: "LIMITED CAPACITY",
  HIGH_LOAD: "HIGH LOAD",
  CRITICAL: "CRITICAL",
  UNAVAILABLE: "UNAVAILABLE",
};

export const DRIVER_STATUS = {
  AVAILABLE: "AVAILABLE",
  ON_ASSIGNMENT: "ON ASSIGNMENT",
  OFFLINE: "OFFLINE",
  GPS_INACTIVE: "GPS INACTIVE",
  UNAVAILABLE: "UNAVAILABLE",
};

export const SYSTEM_STATE = {
  OPERATIONAL: "OPERATIONAL",
  DEGRADED: "DEGRADED",
  DOWN: "DOWN",
  RECONNECTING: "RECONNECTING",
};

export const ALERT_LEVEL = {
  INFORMATION: "INFORMATION",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
};

export const REALTIME_STATE = {
  LIVE: "LIVE",
  CONNECTING: "CONNECTING",
  RECONNECTING: "RECONNECTING",
  OFFLINE: "OFFLINE",
};

export const emergencies = [
  {
    id: "EMG-2026-0472",
    priority: PRIORITY.CRITICAL,
    type: "Cardiac Arrest",
    status: EMERGENCY_STATUS.EN_ROUTE_TO_PATIENT,
    area: "Harbor District",
    coords: { x: 32, y: 58 },
    created: "2026-10-01T13:12:00Z",
    citizen: "CTZ-90413",
    ambulance: "AMB-204",
    driver: "RB-DRV-021",
    hospital: "Bayview General Hospital",
    eta: 4,
    distance: 1.8,
  },
  {
    id: "EMG-2026-0471",
    priority: PRIORITY.HIGH,
    type: "Road Traffic Collision",
    status: EMERGENCY_STATUS.AT_SCENE,
    area: "Northgate Junction",
    coords: { x: 54, y: 34 },
    created: "2026-10-01T13:04:00Z",
    citizen: "CTZ-90408",
    ambulance: "AMB-118",
    driver: "RB-DRV-014",
    hospital: "Northgate Trauma Center",
    eta: 0,
    distance: 0,
  },
  {
    id: "EMG-2026-0470",
    priority: PRIORITY.HIGH,
    type: "Respiratory Distress",
    status: EMERGENCY_STATUS.DISPATCHING,
    area: "Eastside Quay",
    coords: { x: 72, y: 64 },
    created: "2026-10-01T13:09:00Z",
    citizen: "CTZ-90399",
    ambulance: null,
    driver: null,
    hospital: null,
    eta: null,
    distance: null,
  },
  {
    id: "EMG-2026-0469",
    priority: PRIORITY.MEDIUM,
    type: "Fall Injury",
    status: EMERGENCY_STATUS.EN_ROUTE_TO_HOSPITAL,
    area: "Old Town Square",
    coords: { x: 44, y: 72 },
    created: "2026-10-01T12:55:00Z",
    citizen: "CTZ-90377",
    ambulance: "AMB-307",
    driver: "RB-DRV-031",
    hospital: "Riverside Medical Center",
    eta: 7,
    distance: 3.2,
  },
  {
    id: "EMG-2026-0468",
    priority: PRIORITY.LOW,
    type: "Minor Laceration",
    status: EMERGENCY_STATUS.CREATED,
    area: "Westbrook Park",
    coords: { x: 22, y: 30 },
    created: "2026-10-01T13:18:00Z",
    citizen: "CTZ-90422",
    ambulance: null,
    driver: null,
    hospital: null,
    eta: null,
    distance: null,
  },
  {
    id: "EMG-2026-0467",
    priority: PRIORITY.CRITICAL,
    type: "Stroke Suspected",
    status: EMERGENCY_STATUS.TRIAGING,
    area: "Southbank Heights",
    coords: { x: 64, y: 80 },
    created: "2026-10-01T13:15:00Z",
    citizen: "CTZ-90419",
    ambulance: null,
    driver: null,
    hospital: null,
    eta: null,
    distance: null,
  },
];

export const ambulances = [
  { id: "AMB-204", reg: "RB-204-A", type: "ALS", driver: "RB-DRV-021", coords: { x: 28, y: 56 }, status: AMBULANCE_STATUS.EN_ROUTE, fuel: 78, battery: 64, assignment: "EMG-2026-0472", eta: 4 },
  { id: "AMB-118", reg: "RB-118-B", type: "ALS", driver: "RB-DRV-014", coords: { x: 52, y: 36 }, status: AMBULANCE_STATUS.AT_SCENE, fuel: 54, battery: 41, assignment: "EMG-2026-0471", eta: 0 },
  { id: "AMB-307", reg: "RB-307-C", type: "BLS", driver: "RB-DRV-031", coords: { x: 46, y: 70 }, status: AMBULANCE_STATUS.EN_ROUTE_TO_HOSPITAL, fuel: 67, battery: 72, assignment: "EMG-2026-0469", eta: 7 },
  { id: "AMB-512", reg: "RB-512-D", type: "ALS", driver: "RB-DRV-048", coords: { x: 38, y: 48 }, status: AMBULANCE_STATUS.AVAILABLE, fuel: 92, battery: 88, assignment: null, eta: null },
  { id: "AMB-220", reg: "RB-220-E", type: "BLS", driver: "RB-DRV-007", coords: { x: 66, y: 52 }, status: AMBULANCE_STATUS.AVAILABLE, fuel: 81, battery: 79, assignment: null, eta: null },
  { id: "AMB-433", reg: "RB-433-F", type: "NEC", driver: null, coords: { x: 80, y: 22 }, status: AMBULANCE_STATUS.MAINTENANCE, fuel: 100, battery: 12, assignment: null, eta: null },
  { id: "AMB-109", reg: "RB-109-G", type: "BLS", driver: "RB-DRV-052", coords: { x: 18, y: 64 }, status: AMBULANCE_STATUS.OFFLINE, fuel: 23, battery: 0, assignment: null, eta: null },
];

export const drivers = [
  { id: "RB-DRV-021", name: "Marcus Hale", status: DRIVER_STATUS.ON_ASSIGNMENT, ambulance: "AMB-204", gps: "ACTIVE", coords: { x: 28, y: 56 }, assignment: "EMG-2026-0472", shift: "Day" },
  { id: "RB-DRV-014", name: "Priya Nair", status: DRIVER_STATUS.ON_ASSIGNMENT, ambulance: "AMB-118", gps: "ACTIVE", coords: { x: 52, y: 36 }, assignment: "EMG-2026-0471", shift: "Day" },
  { id: "RB-DRV-031", name: "Daniel Cho", status: DRIVER_STATUS.ON_ASSIGNMENT, ambulance: "AMB-307", gps: "ACTIVE", coords: { x: 46, y: 70 }, assignment: "EMG-2026-0469", shift: "Day" },
  { id: "RB-DRV-048", name: "Sara Lindqvist", status: DRIVER_STATUS.AVAILABLE, ambulance: "AMB-512", gps: "ACTIVE", coords: { x: 38, y: 48 }, assignment: null, shift: "Day" },
  { id: "RB-DRV-007", name: "Omar Farouk", status: DRIVER_STATUS.AVAILABLE, ambulance: "AMB-220", gps: "ACTIVE", coords: { x: 66, y: 52 }, assignment: null, shift: "Day" },
  { id: "RB-DRV-052", name: "Elena Vasquez", status: DRIVER_STATUS.OFFLINE, ambulance: "AMB-109", gps: "INACTIVE", coords: { x: 18, y: 64 }, assignment: null, shift: "Off" },
];

export const hospitals = [
  { id: "HSP-01", name: "Bayview General Hospital", coords: { x: 30, y: 62 }, status: HOSPITAL_STATUS.OPERATIONAL, ed: { used: 8, total: 16 }, icu: { used: 5, total: 10 }, trauma: { used: 3, total: 6 }, incoming: 1 },
  { id: "HSP-02", name: "Northgate Trauma Center", coords: { x: 56, y: 32 }, status: HOSPITAL_STATUS.HIGH_LOAD, ed: { used: 19, total: 20 }, icu: { used: 8, total: 10 }, trauma: { used: 5, total: 6 }, incoming: 1 },
  { id: "HSP-03", name: "Riverside Medical Center", coords: { x: 48, y: 74 }, status: HOSPITAL_STATUS.LIMITED_CAPACITY, ed: { used: 12, total: 14 }, icu: { used: 6, total: 8 }, trauma: { used: 2, total: 4 }, incoming: 1 },
  { id: "HSP-04", name: "Southbank Heights Hospital", coords: { x: 66, y: 82 }, status: HOSPITAL_STATUS.CRITICAL, ed: { used: 17, total: 18 }, icu: { used: 9, total: 9 }, trauma: { used: 4, total: 4 }, incoming: 0 },
  { id: "HSP-05", name: "Westbrook Community Hospital", coords: { x: 20, y: 28 }, status: HOSPITAL_STATUS.OPERATIONAL, ed: { used: 5, total: 12 }, icu: { used: 2, total: 6 }, trauma: { used: 1, total: 4 }, incoming: 0 },
];

export const alerts = [
  { id: "ALT-901", level: ALERT_LEVEL.CRITICAL, title: "Hospital capacity critical", detail: "Southbank Heights Hospital — ICU at 100%", entity: "HSP-04", time: "2026-10-01T13:10:00Z", ack: false },
  { id: "ALT-902", level: ALERT_LEVEL.WARNING, title: "Ambulance delayed", detail: "AMB-204 ETA increased from 3 to 4 min (traffic)", entity: "AMB-204", time: "2026-10-01T13:08:00Z", ack: false },
  { id: "ALT-903", level: ALERT_LEVEL.CRITICAL, title: "No ambulance available", detail: "EMG-2026-0470 awaiting dispatch — 0 ALS within range", entity: "EMG-2026-0470", time: "2026-10-01T13:09:00Z", ack: false },
  { id: "ALT-904", level: ALERT_LEVEL.WARNING, title: "GPS inactive", detail: "Driver RB-DRV-052 GPS signal lost", entity: "RB-DRV-052", time: "2026-10-01T12:40:00Z", ack: true },
  { id: "ALT-905", level: ALERT_LEVEL.INFORMATION, title: "Handover completed", detail: "EMG-2026-0465 handed over at Northgate Trauma Center", entity: "EMG-2026-0465", time: "2026-10-01T12:30:00Z", ack: true },
];

export const systemServices = [
  { name: "API Gateway", state: SYSTEM_STATE.OPERATIONAL, latency: 42, checked: "2026-10-01T13:20:00Z" },
  { name: "PostgreSQL / PostGIS", state: SYSTEM_STATE.OPERATIONAL, latency: 18, checked: "2026-10-01T13:20:00Z" },
  { name: "Redis Cache", state: SYSTEM_STATE.OPERATIONAL, latency: 4, checked: "2026-10-01T13:20:00Z" },
  { name: "Realtime / WebSocket", state: SYSTEM_STATE.OPERATIONAL, latency: 31, checked: "2026-10-01T13:20:00Z" },
  { name: "AI Service", state: SYSTEM_STATE.DEGRADED, latency: 1280, checked: "2026-10-01T13:19:00Z" },
  { name: "Object Storage", state: SYSTEM_STATE.OPERATIONAL, latency: 67, checked: "2026-10-01T13:20:00Z" },
];

export const auditEvents = [
  { id: "AUD-5501", operator: "ops.kira", action: "Ambulance assigned", entity: "EMG-2026-0472", from: "DISPATCHING", to: "ASSIGNED", time: "2026-10-01T13:13:00Z" },
  { id: "AUD-5500", operator: "ops.kira", action: "Emergency escalated", entity: "EMG-2026-0467", from: "HIGH", to: "CRITICAL", time: "2026-10-01T13:15:00Z" },
  { id: "AUD-5499", operator: "ops.dane", action: "Hospital changed", entity: "EMG-2026-0469", from: "Northgate Trauma Center", to: "Riverside Medical Center", time: "2026-10-01T12:58:00Z" },
  { id: "AUD-5498", operator: "ops.dane", action: "Ambulance reassigned", entity: "EMG-2026-0471", from: "AMB-220", to: "AMB-118", time: "2026-10-01T13:05:00Z" },
  { id: "AUD-5497", operator: "system", action: "Emergency cancelled", entity: "EMG-2026-0462", from: "EN_ROUTE_TO_PATIENT", to: "CANCELLED", time: "2026-10-01T12:20:00Z" },
];

export const timelineFor = (emergencyId) => {
  const map = {
    "EMG-2026-0472": [
      { event: "Emergency Created", actor: "Citizen CTZ-90413", time: "13:12:00", state: "done" },
      { event: "Triaged — Priority CRITICAL", actor: "AI Service", time: "13:12:08", state: "done" },
      { event: "Dispatch Initiated", actor: "ops.kira", time: "13:12:30", state: "done" },
      { event: "Ambulance Assigned — AMB-204", actor: "ops.kira", time: "13:13:00", state: "done" },
      { event: "Driver Accepted — RB-DRV-021", actor: "RB-DRV-021", time: "13:13:20", state: "done" },
      { event: "Departed to Scene", actor: "AMB-204", time: "13:13:45", state: "active" },
      { event: "At Scene", actor: "AMB-204", time: "—", state: "pending" },
      { event: "Patient Picked Up", actor: "AMB-204", time: "—", state: "pending" },
      { event: "Hospital Notified — Bayview General", actor: "ops.kira", time: "—", state: "pending" },
      { event: "Hospital Arrival", actor: "AMB-204", time: "—", state: "pending" },
      { event: "Handover", actor: "HSP-01", time: "—", state: "pending" },
      { event: "Completed", actor: "system", time: "—", state: "pending" },
    ],
  };
  return map[emergencyId] || [
    { event: "Emergency Created", actor: "Citizen", time: "—", state: "done" },
    { event: "Triaging", actor: "AI Service", time: "—", state: "active" },
    { event: "Dispatch", actor: "—", time: "—", state: "pending" },
    { event: "Assigned", actor: "—", time: "—", state: "pending" },
    { event: "Completed", actor: "—", time: "—", state: "pending" },
  ];
};

export const kpis = {
  activeEmergencies: emergencies.filter((e) => !["COMPLETED", "CANCELLED", "FAILED"].includes(e.status)).length,
  critical: emergencies.filter((e) => e.priority === PRIORITY.CRITICAL && !["COMPLETED", "CANCELLED"].includes(e.status)).length,
  ambulancesActive: ambulances.filter((a) => !["AVAILABLE", "OFFLINE", "MAINTENANCE"].includes(a.status)).length,
  ambulancesAvailable: ambulances.filter((a) => a.status === AMBULANCE_STATUS.AVAILABLE).length,
  hospitalsOnline: hospitals.filter((h) => h.status !== HOSPITAL_STATUS.UNAVAILABLE).length,
  criticalAlerts: alerts.filter((a) => a.level === ALERT_LEVEL.CRITICAL && !a.ack).length,
};

// ---- Full incident timeline (13-step canonical lifecycle) ----
export const TIMELINE_STAGES = [
  "Emergency Created",
  "Triaged",
  "Dispatch Initiated",
  "Ambulance Assigned",
  "Driver Accepted",
  "Departed",
  "At Scene",
  "Patient Picked Up",
  "Hospital Notified",
  "Hospital Arrival",
  "Handover",
  "Completed",
];

export const fullTimelineFor = (emergencyId) => {
  const base = timelineFor(emergencyId);
  // Ensure all 13 stages exist; fill missing as pending
  const present = new Set(base.map((b) => b.event.split(" — ")[0]));
  const merged = [...base];
  for (const stage of TIMELINE_STAGES) {
    if (![...present].some((p) => stage.startsWith(p) || p.startsWith(stage))) {
      merged.push({ event: stage, actor: "—", time: "—", state: "pending" });
    }
  }
  return merged;
};

// ---- Ambulance / Driver / Hospital detail enrichment ----
export const ambulanceHistory = (id) => [
  { event: "Shift started", time: "2026-10-01T06:00:00Z", meta: "Base RB-STN-01" },
  { event: "Assigned to " + id, time: "2026-10-01T13:13:00Z", meta: "EMG-2026-0472" },
  { event: "Departed to scene", time: "2026-10-01T13:13:45Z", meta: "Harbor District" },
  { event: "Refueled", time: "2026-09-30T22:10:00Z", meta: "78% → 100%" },
  { event: "Maintenance check", time: "2026-09-29T14:00:00Z", meta: "Passed" },
];

export const ambulanceEquipment = [
  { name: "Defibrillator", status: "OPERATIONAL" },
  { name: "Cardiac Monitor", status: "OPERATIONAL" },
  { name: "Oxygen Supply", status: "OPERATIONAL" },
  { name: "Trauma Kit", status: "OPERATIONAL" },
  { name: "Stretcher", status: "OPERATIONAL" },
  { name: "Ventilator", status: "CHECK DUE" },
];

export const driverHistory = (id) => [
  { event: "Clocked in", time: "2026-10-01T06:00:00Z", meta: "Shift Day" },
  { event: "Accepted assignment", time: "2026-10-01T13:13:20Z", meta: "EMG-2026-0472" },
  { event: "GPS active", time: "2026-10-01T06:02:00Z", meta: "Signal strong" },
  { event: "Last trip completed", time: "2026-09-30T20:45:00Z", meta: "EMG-2026-0451" },
];

export const hospitalDepartments = [
  { name: "Emergency Dept", key: "ed" },
  { name: "ICU", key: "icu" },
  { name: "Trauma", key: "trauma" },
  { name: "Cardiology", key: "cardio", used: 4, total: 8 },
  { name: "Radiology", key: "radio", used: 2, total: 4 },
];

export const hospitalActivity = (id) => [
  { event: "Handover completed", time: "2026-10-01T12:30:00Z", meta: "EMG-2026-0465" },
  { event: "Incoming ambulance", time: "2026-10-01T13:14:00Z", meta: "AMB-204 · ETA 4m" },
  { event: "Capacity warning", time: "2026-10-01T13:10:00Z", meta: "ICU at 100%" },
  { event: "Bed freed", time: "2026-10-01T12:05:00Z", meta: "ED bed 12" },
];

// ---- Notifications ----
export const NOTIF_TYPE = {
  EMERGENCY: "EMERGENCY",
  AMBULANCE: "AMBULANCE",
  HOSPITAL: "HOSPITAL",
  DISPATCH: "DISPATCH",
  SYSTEM: "SYSTEM",
  REALTIME: "REALTIME",
};

export const notifications = [
  { id: "NTF-01", type: NOTIF_TYPE.EMERGENCY, severity: ALERT_LEVEL.CRITICAL, title: "New critical emergency", detail: "EMG-2026-0472 · Cardiac Arrest · Harbor District", entity: "EMG-2026-0472", time: "2026-10-01T13:12:00Z", read: false },
  { id: "NTF-02", type: NOTIF_TYPE.HOSPITAL, severity: ALERT_LEVEL.CRITICAL, title: "Hospital capacity critical", detail: "Southbank Heights Hospital — ICU at 100%", entity: "HSP-04", time: "2026-10-01T13:10:00Z", read: false },
  { id: "NTF-03", type: NOTIF_TYPE.AMBULANCE, severity: ALERT_LEVEL.WARNING, title: "Ambulance delayed", detail: "AMB-204 ETA increased 3 → 4 min", entity: "AMB-204", time: "2026-10-01T13:08:00Z", read: false },
  { id: "NTF-04", type: NOTIF_TYPE.DISPATCH, severity: ALERT_LEVEL.CRITICAL, title: "No ambulance available", detail: "EMG-2026-0470 awaiting dispatch", entity: "EMG-2026-0470", time: "2026-10-01T13:09:00Z", read: false },
  { id: "NTF-05", type: NOTIF_TYPE.EMERGENCY, severity: ALERT_LEVEL.WARNING, title: "Emergency escalated", detail: "EMG-2026-0467 escalated HIGH → CRITICAL", entity: "EMG-2026-0467", time: "2026-10-01T13:15:00Z", read: true },
  { id: "NTF-06", type: NOTIF_TYPE.SYSTEM, severity: ALERT_LEVEL.WARNING, title: "AI Service degraded", detail: "Latency 1280ms — triage running in fallback", entity: "AI Service", time: "2026-10-01T13:19:00Z", read: true },
  { id: "NTF-07", type: NOTIF_TYPE.AMBULANCE, severity: ALERT_LEVEL.WARNING, title: "GPS inactive", detail: "Driver RB-DRV-052 GPS signal lost", entity: "RB-DRV-052", time: "2026-10-01T12:40:00Z", read: true },
  { id: "NTF-08", type: NOTIF_TYPE.EMERGENCY, severity: ALERT_LEVEL.INFORMATION, title: "Handover completed", detail: "EMG-2026-0465 at Northgate Trauma Center", entity: "EMG-2026-0465", time: "2026-10-01T12:30:00Z", read: true },
];

// ---- Escalation Centre (incidents requiring operator intervention) ----
export const ESCALATION_TYPE = {
  NO_AMBULANCE: "NO AMBULANCE AVAILABLE",
  HOSPITAL_UNAVAILABLE: "HOSPITAL UNAVAILABLE",
  MAJOR_DELAY: "MAJOR DELAY",
  GPS_LOST: "GPS LOST",
  EMERGENCY_UNRESPONSIVE: "EMERGENCY UNRESPONSIVE",
  CRITICAL_CAPACITY: "CRITICAL CAPACITY",
  DISPATCH_FAILURE: "DISPATCH FAILURE",
};

export const escalations = [
  { id: "ESC-01", type: ESCALATION_TYPE.NO_AMBULANCE, severity: ALERT_LEVEL.CRITICAL, entity: "EMG-2026-0470", detail: "0 ALS units within range of Eastside Quay", status: "OPEN", time: "2026-10-01T13:09:00Z" },
  { id: "ESC-02", type: ESCALATION_TYPE.CRITICAL_CAPACITY, severity: ALERT_LEVEL.CRITICAL, entity: "HSP-04", detail: "Southbank Heights ICU at 100% — divert incoming", status: "OPEN", time: "2026-10-01T13:10:00Z" },
  { id: "ESC-03", type: ESCALATION_TYPE.MAJOR_DELAY, severity: ALERT_LEVEL.WARNING, entity: "AMB-204", detail: "ETA delta +1m · traffic on Harbor Bridge", status: "OPEN", time: "2026-10-01T13:08:00Z" },
  { id: "ESC-04", type: ESCALATION_TYPE.GPS_LOST, severity: ALERT_LEVEL.WARNING, entity: "RB-DRV-052", detail: "GPS inactive 33m — last known East Industrial", status: "ACKNOWLEDGED", time: "2026-10-01T12:40:00Z" },
  { id: "ESC-05", type: ESCALATION_TYPE.DISPATCH_FAILURE, severity: ALERT_LEVEL.CRITICAL, entity: "EMG-2026-0468", detail: "Auto-dispatch rejected · no BLS available", status: "OPEN", time: "2026-10-01T13:18:00Z" },
  { id: "ESC-06", type: ESCALATION_TYPE.HOSPITAL_UNAVAILABLE, severity: ALERT_LEVEL.WARNING, entity: "HSP-02", detail: "Northgate Trauma ED near saturation 19/20", status: "RESOLVED", time: "2026-10-01T11:55:00Z" },
];

// ---- System incidents (for C10 critical system alert) ----
export const systemIncidents = [
  { id: "INC-01", service: "Realtime / WebSocket", severity: ALERT_LEVEL.CRITICAL, status: "OUTAGE", lastKnown: "Last event 4m ago · 14 subscriptions stale", time: "2026-10-01T13:16:00Z", recovery: "RECONNECTING" },
  { id: "INC-02", service: "AI Service", severity: ALERT_LEVEL.WARNING, status: "DEGRADED", lastKnown: "Triage latency 1280ms · fallback mode", time: "2026-10-01T13:19:00Z", recovery: "THROTTLED" },
  { id: "INC-03", service: "API Gateway", severity: ALERT_LEVEL.CRITICAL, status: "DEGRADED", lastKnown: "5xx rate 12% · dispatch endpoint impacted", time: "2026-10-01T13:21:00Z", recovery: "FAILOVER IN PROGRESS" },
];

// ---- Geographic intelligence ----
export const heatmapPoints = [
  { id: "HM-01", area: "Harbor District", coords: { x: 32, y: 58 }, intensity: 94, count: 8, topPriority: PRIORITY.CRITICAL },
  { id: "HM-02", area: "Northgate Junction", coords: { x: 54, y: 34 }, intensity: 78, count: 6, topPriority: PRIORITY.HIGH },
  { id: "HM-03", area: "Eastside Quay", coords: { x: 72, y: 64 }, intensity: 71, count: 5, topPriority: PRIORITY.HIGH },
  { id: "HM-04", area: "Southbank Heights", coords: { x: 64, y: 80 }, intensity: 66, count: 4, topPriority: PRIORITY.CRITICAL },
  { id: "HM-05", area: "Old Town Square", coords: { x: 44, y: 72 }, intensity: 48, count: 3, topPriority: PRIORITY.MEDIUM },
  { id: "HM-06", area: "Westbrook Park", coords: { x: 22, y: 30 }, intensity: 32, count: 2, topPriority: PRIORITY.LOW },
];

export const coverageGaps = [
  { id: "CG-01", area: "East Industrial", coords: { x: 18, y: 64 }, gap: "No ambulance within 8km", severity: ALERT_LEVEL.WARNING },
  { id: "CG-02", area: "Harbor Pier 9", coords: { x: 88, y: 78 }, gap: "Nearest BLS 11 min away", severity: ALERT_LEVEL.CRITICAL },
];

export const responseHotspots = [
  { id: "RH-01", area: "Harbor District", avgResponse: 5.2, avgDispatch: 1.4, avgTravel: 3.1, avgHandover: 6.8, volume: 8 },
  { id: "RH-02", area: "Northgate Junction", avgResponse: 6.1, avgDispatch: 1.8, avgTravel: 3.6, avgHandover: 7.4, volume: 6 },
  { id: "RH-03", area: "Eastside Quay", avgResponse: 7.8, avgDispatch: 2.6, avgTravel: 4.4, avgHandover: 8.1, volume: 5 },
  { id: "RH-04", area: "Southbank Heights", avgResponse: 6.9, avgDispatch: 1.9, avgTravel: 4.0, avgHandover: 7.0, volume: 4 },
  { id: "RH-05", area: "Old Town Square", avgResponse: 5.6, avgDispatch: 1.2, avgTravel: 3.4, avgHandover: 6.2, volume: 3 },
];

// ---- Analytics metrics ----
export const operationsAnalytics = {
  totals: { total: 142, active: 6, critical: 2, completed: 124, cancelled: 9, diverted: 3 },
  averages: { responseTime: 6.4, dispatchTime: 1.6, hospitalArrival: 12.1, handover: 7.2 },
  trend: [
    { day: "Mon", emergencies: 19, response: 6.8 },
    { day: "Tue", emergencies: 24, response: 6.2 },
    { day: "Wed", emergencies: 21, response: 5.9 },
    { day: "Thu", emergencies: 28, response: 6.4 },
    { day: "Fri", emergencies: 31, response: 7.1 },
    { day: "Sat", emergencies: 17, response: 6.5 },
    { day: "Sun", emergencies: 14, response: 5.4 },
  ],
  statusBreakdown: [
    { name: "Completed", value: 124, key: "operational" },
    { name: "Active", value: 6, key: "primary" },
    { name: "Cancelled", value: 9, key: "muted" },
    { name: "Diverted", value: 3, key: "warning" },
  ],
};

export const fleetAnalytics = {
  utilization: 64,
  available: 29,
  active: 43,
  avgTripDuration: 18.4,
  avgResponse: 6.4,
  maintenance: 14,
  downtime: 8,
  trend: [
    { day: "Mon", utilization: 58, trips: 14 },
    { day: "Tue", utilization: 66, trips: 18 },
    { day: "Wed", utilization: 61, trips: 16 },
    { day: "Thu", utilization: 70, trips: 21 },
    { day: "Fri", utilization: 74, trips: 24 },
    { day: "Sat", utilization: 55, trips: 12 },
    { day: "Sun", utilization: 48, trips: 9 },
  ],
  typeBreakdown: [
    { name: "ALS", value: 4 },
    { name: "BLS", value: 3 },
    { name: "NEC", value: 1 },
  ],
};

export const hospitalAnalytics = {
  avgLoad: 72,
  incoming: 3,
  capacityUtilization: 78,
  avgArrival: 11.8,
  avgHandover: 7.2,
  diversions: 3,
  criticalCapacityEvents: 2,
  loadByHospital: [
    { name: "Bayview", load: 58 },
    { name: "Northgate", load: 92 },
    { name: "Riverside", load: 81 },
    { name: "Southbank", load: 97 },
    { name: "Westbrook", load: 44 },
  ],
  handoverTrend: [
    { day: "Mon", arrival: 12.4, handover: 7.6 },
    { day: "Tue", arrival: 11.9, handover: 7.1 },
    { day: "Wed", arrival: 12.6, handover: 7.4 },
    { day: "Thu", arrival: 11.4, handover: 6.8 },
    { day: "Fri", arrival: 13.1, handover: 7.9 },
    { day: "Sat", arrival: 10.8, handover: 6.4 },
    { day: "Sun", arrival: 10.2, handover: 6.1 },
  ],
};