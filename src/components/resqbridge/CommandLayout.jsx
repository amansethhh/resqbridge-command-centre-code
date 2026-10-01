import React, { useState, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { CriticalStateProvider } from "./CriticalState";
import { REALTIME_STATE } from "@/lib/resqbridge/mockData";

export const useCommandContext = () => useOutletContext();

export default function CommandLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const toggleTheme = (next) => {
    if (next === "light" || next === "dark") setTheme(next);
    else setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <CriticalStateProvider>
      <div className="min-h-screen flex">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar
            onOpenMobile={() => setMobileOpen(true)}
            realtime={REALTIME_STATE.LIVE}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main className="flex-1 min-w-0 p-4 lg:p-6">
            <div className="max-w-[1600px] mx-auto animate-rb-fade-up">
              <Outlet context={{ theme, setTheme, toggleTheme }} />
            </div>
          </main>
        </div>
      </div>
    </CriticalStateProvider>
  );
}