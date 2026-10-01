import React, { useState } from "react";
import { FileText, Search, User, ArrowRight } from "lucide-react";
import { GlassPanel, SectionTitle } from "@/components/resqbridge/Glass";
import { auditEvents } from "@/lib/resqbridge/mockData";
import { clockTime, timeAgo } from "@/lib/resqbridge/format";

export default function AuditLogs() {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("ALL");

  const actions = ["ALL", ...Array.from(new Set(auditEvents.map((a) => a.action)))];

  const filtered = auditEvents.filter((a) => {
    if (action !== "ALL" && a.action !== action) return false;
    if (query) {
      const q = query.toLowerCase();
      return a.operator.toLowerCase().includes(q) || a.entity.toLowerCase().includes(q) || a.action.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <GlassPanel elevated className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="glass rounded-xl h-10 flex items-center gap-2 px-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-rb-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by operator, entity, action…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-rb-muted/70 text-foreground" />
        </div>
        <div className="glass rounded-xl h-10 flex items-center gap-2 pl-3 pr-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rb-muted">Action</span>
          <select value={action} onChange={(e) => setAction(e.target.value)} className="bg-transparent outline-none text-sm font-semibold text-foreground cursor-pointer pr-1">
            {actions.map((o) => <option key={o} value={o} className="bg-card">{o === "ALL" ? "All" : o}</option>)}
          </select>
        </div>
      </GlassPanel>

      <GlassPanel elevated className="p-4">
        <SectionTitle icon={FileText} title="Audit Trail" action={<span className="text-xs font-semibold text-rb-muted">{filtered.length} events</span>} />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-rb-muted border-b border-border/60">
                <th className="text-left py-2 px-2">Operator</th>
                <th className="text-left py-2 px-2">Action</th>
                <th className="text-left py-2 px-2">Entity</th>
                <th className="text-left py-2 px-2 hidden md:table-cell">Previous</th>
                <th className="text-left py-2 px-2 hidden md:table-cell">New</th>
                <th className="text-right py-2 px-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rb-primary to-rb-cyan text-white text-[10px] font-bold flex items-center justify-center font-heading shrink-0">
                        {a.operator === "system" ? "SY" : a.operator.replace("ops.", "").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-foreground text-xs">{a.operator}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-semibold text-foreground">{a.action}</td>
                  <td className="py-3 px-2 text-rb-muted font-mono text-xs">{a.entity}</td>
                  <td className="py-3 px-2 text-rb-muted text-xs hidden md:table-cell">{a.from}</td>
                  <td className="py-3 px-2 text-foreground text-xs font-semibold hidden md:table-cell">{a.to}</td>
                  <td className="py-3 px-2 text-right text-rb-muted text-xs font-mono">{timeAgo(a.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}