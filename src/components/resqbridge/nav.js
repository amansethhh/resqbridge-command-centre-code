import {
  LayoutDashboard, Siren, Send, Ambulance, User, Hospital, Map, Bell,
  BarChart3, FileText, Activity, Settings, BellRing, AlertOctagon,
} from "lucide-react";

export const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/emergencies", label: "Emergencies", icon: Siren },
  { to: "/dispatch", label: "Dispatch", icon: Send },
  { to: "/ambulances", label: "Ambulances", icon: Ambulance },
  { to: "/drivers", label: "Drivers", icon: User },
  { to: "/hospitals", label: "Hospitals", icon: Hospital },
  { to: "/maps", label: "Maps / Intel", icon: Map },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/notifications", label: "Notifications", icon: BellRing },
  { to: "/escalations", label: "Escalations", icon: AlertOctagon },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/audit", label: "Audit Logs", icon: FileText },
  { to: "/system", label: "System Health", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
];