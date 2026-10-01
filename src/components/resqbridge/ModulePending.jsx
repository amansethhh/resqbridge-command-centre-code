import React from "react";
import { Wrench } from "lucide-react";
import { GlassPanel, CommandButton } from "@/components/resqbridge/Glass";

// Premium "module in progress" state for screens staged in a follow-up turn.
export default function ModulePending({ title, description, icon: Icon = Wrench }) {
  return (
    <GlassPanel elevated className="p-10 flex flex-col items-center justify-center text-center min-h-[420px]">
      <div className="icon-tile rounded-2xl w-16 h-16 flex items-center justify-center">
        <Icon className="w-7 h-7 text-rb-primary" strokeWidth={2} />
      </div>
      <h2 className="font-heading font-extrabold text-xl text-foreground mt-4">{title}</h2>
      <p className="text-sm text-rb-muted mt-2 max-w-md">{description}</p>
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-rb-muted">
        <span className="w-2 h-2 rounded-full bg-rb-warning blink" />
        Module staged for next build phase
      </div>
    </GlassPanel>
  );
}