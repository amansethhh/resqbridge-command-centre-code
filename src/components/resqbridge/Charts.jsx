import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import { GlassPanel } from "@/components/resqbridge/Glass";
import { cn } from "@/lib/utils";

const axis = { fontSize: 11, fill: "hsl(var(--rb-muted))" };
const gridStroke = "hsl(var(--rb-glass-border) / 0.5)";

const tooltipStyle = {
  background: "hsl(var(--rb-glass) / 0.95)",
  backdropFilter: "blur(12px)",
  border: "1px solid hsl(var(--rb-glass-border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--rb-text))",
  boxShadow: "0 10px 30px -12px hsl(var(--rb-shadow) / 0.4)",
};

export function TrendArea({ data, xKey, yKeys, height = 220, colors }) {
  const palette = colors || ["hsl(var(--rb-primary))", "hsl(var(--rb-cyan))", "hsl(var(--rb-operational))"];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          {yKeys.map((k, i) => (
            <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette[i]} stopOpacity={0.4} />
              <stop offset="100%" stopColor={palette[i]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={axis} axisLine={{ stroke: gridStroke }} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        {yKeys.map((k, i) => (
          <Area key={k} type="monotone" dataKey={k} stroke={palette[i]} strokeWidth={2.4} fill={`url(#grad-${k})`} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({ data, xKey, yKeys, height = 220, colors }) {
  const palette = colors || ["hsl(var(--rb-primary))", "hsl(var(--rb-cyan))", "hsl(var(--rb-operational))"];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={axis} axisLine={{ stroke: gridStroke }} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        {yKeys.map((k, i) => (
          <Line key={k} type="monotone" dataKey={k} stroke={palette[i]} strokeWidth={2.4} dot={{ r: 3, fill: palette[i] }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarSeries({ data, xKey, yKeys, height = 220, colors }) {
  const palette = colors || ["hsl(var(--rb-primary))", "hsl(var(--rb-cyan))"];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={axis} axisLine={{ stroke: gridStroke }} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--rb-glass-border) / 0.2)" }} />
        {yKeys.map((k, i) => (
          <Bar key={k} dataKey={k} fill={palette[i]} radius={[6, 6, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

const pieColors = ["hsl(var(--rb-operational))", "hsl(var(--rb-primary))", "hsl(var(--rb-muted))", "hsl(var(--rb-warning))", "hsl(var(--rb-critical))"];

export function Donut({ data, height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none">
          {data.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, color: "hsl(var(--rb-muted))" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ChartCard({ title, icon: Icon, action, children, className = "" }) {
  return (
    <GlassPanel elevated className={cn("p-4", className)}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <div className="icon-tile rounded-lg w-8 h-8 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-rb-primary" strokeWidth={2.2} /></div>}
          <h3 className="font-heading font-bold text-sm text-foreground truncate">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </GlassPanel>
  );
}

export function MetricCard({ label, value, sub, tone = "primary", icon: Icon }) {
  const tones = { primary: "text-rb-primary", critical: "text-rb-critical", warning: "text-rb-warning", operational: "text-rb-operational", info: "text-rb-info" };
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rb-muted">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className={cn("font-heading font-extrabold text-2xl mt-1 tabular-nums", tones[tone])}>{value}</div>
      {sub && <div className="text-[11px] text-rb-muted mt-0.5">{sub}</div>}
    </div>
  );
}