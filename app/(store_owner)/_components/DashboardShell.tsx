"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardShellProps {
  children: React.ReactNode;
  user: User;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

      <div className="lg:ml-72 flex flex-col min-h-screen">
        <DashboardHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
