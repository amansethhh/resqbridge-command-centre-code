import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";
import { navItems } from "./nav";
import Logo from "./Logo";

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 lg:z-30 h-screen shrink-0 transition-all duration-300",
          "glass-elevated border-r border-rb-glass-border/60 flex flex-col",
          collapsed ? "w-[76px]" : "w-[248px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-rb-glass-border/50 shrink-0">
          <Logo compact={collapsed} />
          <button
            onClick={onCloseMobile}
            className="lg:hidden icon-tile rounded-lg w-8 h-8 flex items-center justify-center"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4 text-rb-muted" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold font-heading transition-all duration-200",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-rb-primary/12 text-rb-primary"
                      : "text-rb-muted hover:text-foreground hover:bg-muted/50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-rb-primary" />
                    )}
                    <Icon
                      className={cn("w-[19px] h-[19px] shrink-0", isActive && "text-rb-primary")}
                      strokeWidth={2.2}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden lg:flex items-center justify-end px-2.5 py-3 border-t border-rb-glass-border/50">
          <button
            onClick={onToggleCollapse}
            className="icon-tile rounded-lg w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn("w-4 h-4 text-rb-muted transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>
      </aside>
    </>
  );
}