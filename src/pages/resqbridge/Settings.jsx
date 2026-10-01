import React, { useState } from "react";
import {
  Settings as SettingsIcon, User, Bell, AlertTriangle, Map, Palette, Shield,
  Monitor, Sliders, LogOut, Check, Moon, Sun, Globe, Clock, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel, SectionTitle, CommandButton } from "@/components/resqbridge/Glass";
import { base44 } from "@/api/base44Client";
import { useCommandContext } from "@/components/resqbridge/CommandLayout";

const sections = [
  { key: "profile", label: "Operator Profile", icon: User },
  { key: "notifications", label: "Notification Settings", icon: Bell },
  { key: "alerts", label: "Alert Settings", icon: AlertTriangle },
  { key: "map", label: "Map Preferences", icon: Map },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "security", label: "Security", icon: Shield },
  { key: "session", label: "Session", icon: Clock },
  { key: "system", label: "System Preferences", icon: Sliders },
];

export default function Settings() {
  const ctx = useCommandContext() || {};
  const theme = ctx.theme || "light";
  const onToggleTheme = ctx.toggleTheme;
  const [active, setActive] = useState("profile");
  const [notif, setNotif] = useState({ emergency: true, ambulance: true, hospital: true, dispatch: true, system: false, sound: true });
  const [alerts, setAlerts] = useState({ criticalSnd: true, autoAck: false, escalationSms: true });
  const [map, setMap] = useState({ traffic: true, nightLayer: false, autoZoom: true, clusterMarkers: true });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  const handleLogout = async () => {
    try { await base44.auth.logout(); } catch { /* noop */ }
    window.location.href = "/login";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
      {/* Section nav */}
      <GlassPanel elevated className="p-3 lg:sticky lg:top-20 h-fit">
        <nav className="space-y-1">
          {sections.map((s) => (
            <button key={s.key} onClick={() => setActive(s.key)}
              className={cn("w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold font-heading transition-colors",
                active === s.key ? "bg-rb-primary/12 text-rb-primary" : "text-rb-muted hover:text-foreground hover:bg-muted/50")}>
              <s.icon className="w-[19px] h-[19px] shrink-0" strokeWidth={2.2} />
              {s.label}
            </button>
          ))}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold font-heading text-rb-critical hover:bg-rb-critical/10 transition-colors mt-2 border-t border-border/60 pt-3">
            <LogOut className="w-[19px] h-[19px] shrink-0" strokeWidth={2.2} />Sign out
          </button>
        </nav>
      </GlassPanel>

      <div className="lg:col-span-3 space-y-5">
        {active === "profile" && (
          <GlassPanel elevated className="p-5">
            <SectionTitle icon={User} title="Operator Profile" />
            <div className="mt-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rb-primary to-rb-cyan text-white font-heading font-bold text-xl flex items-center justify-center">KH</div>
              <div>
                <div className="font-heading font-bold text-foreground">K. Hale</div>
                <div className="text-sm text-rb-muted">Command Operator · ops.kira</div>
                <div className="text-[11px] text-rb-muted mt-1">Role: Operator (no administrative privileges)</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Display name" value="K. Hale" />
              <Field label="Email" value="k.hale@resqbridge.io" />
              <Field label="Role" value="Command Operator" />
              <Field label="Station" value="RB-STN-01" />
            </div>
            <div className="mt-4"><CommandButton icon={Check} onClick={save}>Save profile</CommandButton></div>
          </GlassPanel>
        )}

        {active === "notifications" && (
          <GlassPanel elevated className="p-5">
            <SectionTitle icon={Bell} title="Notification Settings" />
            <div className="mt-4 space-y-2">
              <Toggle label="Emergency updates" desc="New, escalated and completed emergencies" checked={notif.emergency} onChange={(v) => setNotif((s) => ({ ...s, emergency: v }))} />
              <Toggle label="Ambulance updates" desc="Status, ETA and delay notifications" checked={notif.ambulance} onChange={(v) => setNotif((s) => ({ ...s, ambulance: v }))} />
              <Toggle label="Hospital capacity alerts" desc="Critical capacity and diversions" checked={notif.hospital} onChange={(v) => setNotif((s) => ({ ...s, hospital: v }))} />
              <Toggle label="Dispatch failures" desc="Failed or blocked dispatch attempts" checked={notif.dispatch} onChange={(v) => setNotif((s) => ({ ...s, dispatch: v }))} />
              <Toggle label="System alerts" desc="Service degradation and outages" checked={notif.system} onChange={(v) => setNotif((s) => ({ ...s, system: v }))} />
              <Toggle label="Notification sound" desc="Audible alert for critical notifications" checked={notif.sound} onChange={(v) => setNotif((s) => ({ ...s, sound: v }))} />
            </div>
            <div className="mt-4"><CommandButton icon={Check} onClick={save}>Save notifications</CommandButton></div>
          </GlassPanel>
        )}

        {active === "alerts" && (
          <GlassPanel elevated className="p-5">
            <SectionTitle icon={AlertTriangle} title="Alert Settings" />
            <div className="mt-4 space-y-2">
              <Toggle label="Critical alert sound" desc="Play sound for critical-level alerts" checked={alerts.criticalSnd} onChange={(v) => setAlerts((s) => ({ ...s, criticalSnd: v }))} />
              <Toggle label="Auto-acknowledge information alerts" desc="Automatically acknowledge low-severity alerts" checked={alerts.autoAck} onChange={(v) => setAlerts((s) => ({ ...s, autoAck: v }))} />
              <Toggle label="Escalation SMS" desc="Send SMS to supervisor on escalation" checked={alerts.escalationSms} onChange={(v) => setAlerts((s) => ({ ...s, escalationSms: v }))} />
            </div>
            <div className="mt-4"><CommandButton icon={Check} onClick={save}>Save alert settings</CommandButton></div>
          </GlassPanel>
        )}

        {active === "map" && (
          <GlassPanel elevated className="p-5">
            <SectionTitle icon={Map} title="Map Preferences" />
            <div className="mt-4 space-y-2">
              <Toggle label="Traffic overlay" desc="Show live traffic conditions" checked={map.traffic} onChange={(v) => setMap((s) => ({ ...s, traffic: v }))} />
              <Toggle label="Night layer" desc="Use darker map tiles in low light" checked={map.nightLayer} onChange={(v) => setMap((s) => ({ ...s, nightLayer: v }))} />
              <Toggle label="Auto-zoom to incident" desc="Zoom to selected emergency automatically" checked={map.autoZoom} onChange={(v) => setMap((s) => ({ ...s, autoZoom: v }))} />
              <Toggle label="Cluster markers" desc="Cluster dense markers at low zoom" checked={map.clusterMarkers} onChange={(v) => setMap((s) => ({ ...s, clusterMarkers: v }))} />
            </div>
            <div className="mt-4"><CommandButton icon={Check} onClick={save}>Save map preferences</CommandButton></div>
          </GlassPanel>
        )}

        {active === "appearance" && (
          <GlassPanel elevated className="p-5">
            <SectionTitle icon={Palette} title="Appearance" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => onToggleTheme?.("light")} className={cn("glass rounded-xl p-4 text-left transition-all", theme === "light" ? "ring-2 ring-rb-primary/50" : "hover:scale-[1.01]")}>
                <Sun className="w-5 h-5 text-rb-warning" /><div className="font-heading font-bold text-foreground mt-2">Light</div><div className="text-[11px] text-rb-muted">Default daylight theme</div>
              </button>
              <button onClick={() => onToggleTheme?.("dark")} className={cn("glass rounded-xl p-4 text-left transition-all", theme === "dark" ? "ring-2 ring-rb-primary/50" : "hover:scale-[1.01]")}>
                <Moon className="w-5 h-5 text-rb-primary" /><div className="font-heading font-bold text-foreground mt-2">Dark</div><div className="text-[11px] text-rb-muted">Low-light command mode</div>
              </button>
            </div>
          </GlassPanel>
        )}

        {active === "security" && (
          <GlassPanel elevated className="p-5">
            <SectionTitle icon={Shield} title="Security" />
            <div className="mt-4 space-y-3">
              <div className="glass rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-rb-operational" /><div><div className="text-sm font-semibold text-foreground">Two-factor authentication</div><div className="text-[11px] text-rb-muted">Enabled via authenticator app</div></div></div>
                <CommandButton variant="secondary" size="sm">Manage</CommandButton>
              </div>
              <div className="glass rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-rb-info" /><div><div className="text-sm font-semibold text-foreground">Active sessions</div><div className="text-[11px] text-rb-muted">2 devices · last from Metro Ops</div></div></div>
                <CommandButton variant="secondary" size="sm">Review</CommandButton>
              </div>
            </div>
          </GlassPanel>
        )}

        {active === "session" && (
          <GlassPanel elevated className="p-5">
            <SectionTitle icon={Clock} title="Session" />
            <div className="mt-4 space-y-2">
              <Field label="Session started" value="13:02 · 01 Oct 2026" />
              <Field label="Session ID" value="SES-KH-20261001" mono />
              <Field label="Last activity" value="just now" />
            </div>
            <div className="mt-4"><CommandButton variant="danger" icon={LogOut} onClick={handleLogout}>Sign out of this session</CommandButton></div>
          </GlassPanel>
        )}

        {active === "system" && (
          <GlassPanel elevated className="p-5">
            <SectionTitle icon={Sliders} title="System Preferences" />
            <div className="mt-4 space-y-2">
              <Toggle label="Compact density" desc="Tighter spacing for high information density" checked={true} onChange={() => {}} />
              <Toggle label="Show KPI animations" desc="Animate KPI card updates" checked={true} onChange={() => {}} />
              <Toggle label="Confirm critical actions" desc="Require deliberate confirmation for dispatch and escalation" checked={true} onChange={() => {}} />
            </div>
            <div className="mt-4 glass rounded-xl p-3 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-rb-muted" />
              <span className="text-[11px] text-rb-muted">Administrative controls are restricted to admins. Your role is Operator.</span>
            </div>
            <div className="mt-4"><CommandButton icon={Check} onClick={save}>Save preferences</CommandButton></div>
          </GlassPanel>
        )}

        {saved && (
          <div className="glass rounded-xl p-3 flex items-center gap-2 border border-rb-operational/30 animate-rb-slide-in">
            <Check className="w-4 h-4 text-rb-operational" />
            <span className="text-sm font-semibold text-foreground">Settings saved.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, mono = false }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">{label}</div>
      <div className={cn("text-sm font-semibold text-foreground mt-0.5", mono && "font-mono text-xs")}>{value}</div>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="w-full flex items-center justify-between gap-3 glass rounded-xl p-3 text-left hover:bg-muted/40 transition-colors">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {desc && <div className="text-[11px] text-rb-muted">{desc}</div>}
      </div>
      <span className={cn("w-11 h-6 rounded-full p-0.5 shrink-0 transition-colors", checked ? "bg-rb-primary" : "bg-muted")}>
        <span className={cn("block w-5 h-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-5")} />
      </span>
    </button>
  );
}