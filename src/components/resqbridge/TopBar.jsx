import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, Sun, Moon, Settings, User, LogOut, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./nav";
import RealtimeIndicator from "./RealtimeIndicator";
import { IconButton } from "./Glass";
import { REALTIME_STATE, kpis, alerts, ALERT_LEVEL } from "@/lib/resqbridge/mockData";
import { timeAgo } from "@/lib/resqbridge/format";
import { base44 } from "@/api/base44Client";

const levelDot = {
  [ALERT_LEVEL.CRITICAL]: "bg-rb-critical",
  [ALERT_LEVEL.WARNING]: "bg-rb-warning",
  [ALERT_LEVEL.INFORMATION]: "bg-rb-info",
};
const levelText = {
  [ALERT_LEVEL.CRITICAL]: "text-rb-critical",
  [ALERT_LEVEL.WARNING]: "text-rb-warning",
  [ALERT_LEVEL.INFORMATION]: "text-rb-info",
};

export default function TopBar({ onOpenMobile, realtime = REALTIME_STATE.LIVE, theme, onToggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null); // "notif" | "profile" | null
  const [readIds, setReadIds] = useState(new Set());
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const current = navItems.find((n) =>
    n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to)
  );
  const criticalCount = kpis.criticalAlerts;
  const unread = alerts.filter((a) => !readIds.has(a.id));
  const unreadCount = unread.length;

  // close dropdowns on outside click / route change / escape
  useEffect(() => {
    function onDown(e) {
      if (notifRef.current && !notifRef.current.contains(e.target) &&
          profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    function onKey(e) { if (e.key === "Escape") setOpenMenu(null); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => { setOpenMenu(null); }, [location.pathname]);

  const toggleMenu = (name) => (e) => {
    e?.stopPropagation?.();
    setOpenMenu((m) => (m === name ? null : name));
  };

  const markAllRead = () => setReadIds(new Set(alerts.map((a) => a.id)));

  const handleLogout = async () => {
    setOpenMenu(null);
    try { await base44.auth.logout(); } catch { /* noop */ }
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-elevated border-b border-rb-glass-border/60 flex items-center gap-3 px-4 lg:px-6">
      <button
        onClick={onOpenMobile}
        className="lg:hidden icon-tile rounded-xl w-10 h-10 flex items-center justify-center"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5 text-rb-muted" />
      </button>

      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rb-muted hidden sm:block">
          ResQBridge Command Centre
        </div>
        <h1 className="font-heading font-bold text-[17px] tracking-tight text-foreground truncate leading-tight">
          {current?.label || "Overview"}
        </h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center ml-4 flex-1 max-w-md">
        <div className="glass rounded-xl h-10 flex items-center gap-2 px-3 w-full">
          <Search className="w-4 h-4 text-rb-muted" />
          <input
            placeholder="Search emergencies, ambulances, hospitals…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-rb-muted/70 text-foreground"
          />
          <kbd className="hidden lg:inline text-[10px] font-mono text-rb-muted border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2.5 ml-auto">
        <RealtimeIndicator state={realtime} />

        <IconButton icon={theme === "dark" ? Sun : Moon} label="Toggle theme" onClick={onToggleTheme} />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleMenu("notif")}
            className={cn(
              "icon-tile rounded-xl h-10 px-2.5 flex items-center gap-2 transition-transform hover:scale-[1.02]",
              openMenu === "notif" && "ring-2 ring-rb-primary/50"
            )}
            aria-label="Notifications"
            aria-expanded={openMenu === "notif"}
          >
            <Bell className="w-[18px] h-[18px] text-rb-muted" strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rb-critical text-white text-[10px] font-bold flex items-center justify-center pulse-critical">
                {unreadCount}
              </span>
            )}
          </button>

          {openMenu === "notif" && (
            <div className="absolute right-0 top-12 w-[340px] max-w-[calc(100vw-2rem)] glass-elevated rounded-2xl overflow-hidden animate-rb-scale-in origin-top-right z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-rb-glass-border/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-rb-primary" strokeWidth={2.2} />
                  <span className="font-heading font-bold text-sm text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-rb-critical/15 text-rb-critical rounded-full px-2 py-0.5">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-semibold text-rb-primary hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              </div>

              <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                {alerts.map((a) => {
                  const isRead = readIds.has(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => { setReadIds((s) => new Set(s).add(a.id)); navigate("/alerts"); }}
                      className="w-full text-left px-4 py-3 flex gap-3 hover:bg-muted/40 border-b border-rb-glass-border/40 last:border-0 transition-colors"
                    >
                      <span className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", levelDot[a.level])} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wide", levelText[a.level])}>
                            {a.level}
                          </span>
                          {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-rb-primary" />}
                          <span className="text-[10px] text-rb-muted ml-auto">{timeAgo(a.time)}</span>
                        </div>
                        <div className="text-[13px] font-semibold text-foreground truncate mt-0.5">{a.title}</div>
                        <div className="text-[11px] text-rb-muted truncate">{a.detail}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-3 py-2 border-t border-rb-glass-border/60">
                <button
                  onClick={() => navigate("/alerts")}
                  className="w-full h-9 rounded-lg glass text-sm font-semibold text-foreground hover:bg-muted/60 flex items-center justify-center gap-2"
                >
                  View all alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Operator */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleMenu("profile")}
            className={cn(
              "glass rounded-xl h-10 pl-1.5 pr-2.5 flex items-center gap-2 transition-transform hover:scale-[1.02]",
              openMenu === "profile" && "ring-2 ring-rb-primary/50"
            )}
            aria-label="Operator menu"
            aria-expanded={openMenu === "profile"}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rb-primary to-rb-cyan text-white text-xs font-bold flex items-center justify-center font-heading">
              KH
            </div>
            <div className="hidden sm:block text-left leading-none">
              <div className="text-xs font-bold text-foreground">K. Hale</div>
              <div className="text-[10px] text-rb-muted mt-0.5">Command Operator</div>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-rb-muted transition-transform", openMenu === "profile" && "rotate-180")} />
          </button>

          {openMenu === "profile" && (
            <div className="absolute right-0 top-12 w-[260px] max-w-[calc(100vw-2rem)] glass-elevated rounded-2xl overflow-hidden animate-rb-scale-in origin-top-right z-50">
              <div className="px-4 py-3.5 border-b border-rb-glass-border/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rb-primary to-rb-cyan text-white text-sm font-bold flex items-center justify-center font-heading shrink-0">
                  KH
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">K. Hale</div>
                  <div className="text-[11px] text-rb-muted truncate">Command Operator · ops.kira</div>
                </div>
              </div>

              <div className="p-1.5">
                <MenuItem icon={User} label="Operator profile" onClick={() => navigate("/settings")} />
                <MenuItem icon={Settings} label="Command Centre settings" onClick={() => navigate("/settings")} />
                <MenuItem
                  icon={theme === "dark" ? Sun : Moon}
                  label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  onClick={() => { onToggleTheme(); setOpenMenu(null); }}
                />
              </div>

              <div className="p-1.5 border-t border-rb-glass-border/60">
                <MenuItem icon={LogOut} label="Sign out" danger onClick={handleLogout} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-9 px-2.5 rounded-lg flex items-center gap-2.5 text-sm font-medium transition-colors",
        danger ? "text-rb-critical hover:bg-rb-critical/10" : "text-foreground hover:bg-muted/60"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" strokeWidth={2.2} />
      {label}
    </button>
  );
}