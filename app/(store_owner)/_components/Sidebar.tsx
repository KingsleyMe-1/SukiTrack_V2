"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/utils/cn";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Catalog", href: "/catalog", icon: "inventory_2" },
  { label: "Inventory", href: "/inventory", icon: "warehouse" },
  { label: "Stores", href: "/stores", icon: "storefront" },
  { label: "Sukis", href: "/sukis", icon: "group" },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full flex flex-col py-8 z-50",
        "bg-surface-container-lowest border-r border-outline-variant/30 w-72",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="px-10 mb-14">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-xl">
              auto_graph
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-on-surface">
            SukiTrack
          </span>
        </div>
        <p className="text-[10px] mt-1 text-on-surface-variant uppercase tracking-[0.2em] font-bold opacity-50">
          Store Owner
        </p>
      </div>

      {/* Navigation */}
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
                  : "text-on-surface-variant hover:text-primary hover:bg-primary/5 font-medium"
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile card */}
      <div className="px-6 mt-auto">
        <div className="p-4 bg-surface-container-low rounded-2xl flex items-center space-x-3 border border-outline-variant/20 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-surface-container-lowest shadow-sm flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              person
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-bold text-on-surface truncate">
              Admin User
            </p>
            <p className="text-[11px] text-on-surface-variant opacity-70">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
