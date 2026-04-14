"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/app/utils/cn";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Inventory", href: "/inventory", icon: "inventory" },
  { label: "Stores", href: "/stores", icon: "storefront" },
  { label: "Customers", href: "/customers", icon: "group" },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full flex flex-col py-8 z-50",
        "bg-sidebar border-r border-sidebar-border w-72",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="px-10 mb-14">
        <div className="flex items-center space-x-2">
          <Image src="/suki-track-logo.png" alt="SukiTrack Logo" height={42} width={42} style={{ objectFit: "cover", borderRadius: "10px" }} /> 
          <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
            SukiTrack
          </span>
        </div>
        <p className="text-[10px] mt-1 text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-50">
          Store Owner
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center space-x-3 px-6 py-4 rounded-xl text-sm transition-all duration-300",
                isActive
                  ? "dashboard-nav-active font-bold"
                  : "text-muted-foreground hover:text-sidebar-primary hover:bg-sidebar-accent font-medium"
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-4 bg-sidebar-accent rounded-2xl flex items-center space-x-3 border border-sidebar-border shadow-sm">
          <div className="w-10 h-10 rounded-full bg-muted border-2 border-sidebar shadow-sm flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-muted-foreground text-xl">
              person
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-bold text-sidebar-foreground truncate">
              Admin User
            </p>
            <p className="text-[11px] text-muted-foreground opacity-70">
              Administrator
            </p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            aria-label="Log out"
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Logout confirmation"
        >
          <div
            className="w-full max-w-sm bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center px-8 pt-8 pb-6 text-center">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-destructive text-3xl">
                  logout
                </span>
              </div>
              <h2 className="text-lg font-black text-foreground">
                Do you want to log out?
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5">
                You will be returned to the home page.
              </p>
            </div>

            <div className="grid grid-cols-2 border-t border-border">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="py-4 text-sm font-black text-muted-foreground hover:bg-muted transition-colors border-r border-border"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  router.push("/");
                }}
                className="py-4 text-sm font-black text-destructive hover:bg-destructive/5 transition-colors"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
