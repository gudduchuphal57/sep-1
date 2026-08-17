"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar, { type DashboardTab } from "./sidebar";
import Navbar from "./navbar";
import DashboardChildren from "./tabs/dashboard-children";

export default function Main() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    password?: string;
    avatar?: string;
  }>({
    name: "muneeb.hk",
    email: "muneeb.cssfounder@gmail.com",
    avatar: "/muneeb.png",
  });
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const restoreTab = window.setTimeout(() => {
      const savedTab = window.sessionStorage.getItem("lestow-dashboard-tab");
      const dashboardTabs: DashboardTab[] = [
        "Dashboard",
        "My Websites",
        "Plan",
        "Billing",
        "Profile",
      ];

      if (dashboardTabs.includes(savedTab as DashboardTab)) {
        setActiveTab(savedTab as DashboardTab);
      }
    }, 0);

    return () => window.clearTimeout(restoreTab);
  }, []);

  useEffect(() => {
    const restoreUser = window.setTimeout(() => {
      const saved = window.localStorage.getItem("lestow-user");
      if (!saved) return;
      try {
        const details = JSON.parse(saved);
        if (details.name && details.email) setUser(details);
      } catch {
        window.localStorage.removeItem("lestow-user");
      }
    }, 0);

    return () => window.clearTimeout(restoreUser);
  }, []);

  const saveUser = (nextUser: typeof user) => {
    setUser(nextUser);
    window.localStorage.setItem("lestow-user", JSON.stringify(nextUser));
  };

  const selectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    window.sessionStorage.setItem("lestow-dashboard-tab", tab);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div
      className={`grid h-dvh grid-cols-1 overflow-hidden bg-[#fbfaf9] text-[#18181b] transition-[grid-template-columns] duration-300 ${collapsed
        ? "md:grid-cols-[76px_minmax(0,1fr)]"
        : "md:grid-cols-[260px_minmax(0,1fr)]"
        }`}
    >
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[9990] bg-zinc-950/45 backdrop-blur-[3px] md:hidden"
        />
      )}
      <Sidebar
        activeTab={activeTab}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setCollapsed((current) => !current)}
        onMobileClose={() => setMobileOpen(false)}
        onSelect={(tab) => {
          selectTab(tab);
          setMobileOpen(false);
        }}
      />

      <div className="grid h-dvh min-w-0 grid-rows-[72px_minmax(0,1fr)]">
        <Navbar
          activeTab={activeTab}
          user={user}
          profileOpen={profileOpen}
          profileRef={profileRef}
          onMenuClick={() => setMobileOpen(true)}
          onNavigate={(tab) => {
            selectTab(tab);
            setProfileOpen(false);
          }}
          onProfileToggle={() => setProfileOpen((current) => !current)}
        />
        <main className="min-h-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <DashboardChildren
            activeTab={activeTab}
            user={user}
            onUserSave={saveUser}
            onNavigate={selectTab}
          />
        </main>
      </div>
    </div>
  );
}
