"use client";

import { ThemeToggleButton } from "@/app/components/ui/ThemeToggleButton";
import Button from "@/app/components/ui/Button";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 md:px-10 h-20 w-full sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <button
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        className="lg:hidden p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all active:scale-90"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="hidden lg:block" aria-hidden="true" />

      <div className="flex items-center space-x-2">
        <ThemeToggleButton className="text-muted-foreground hover:bg-card hover:shadow-sm rounded-xl cursor-pointer" />

        <div className="relative">
          <button
            aria-label="View notifications"
            className="p-2.5 text-muted-foreground hover:bg-card hover:shadow-sm transition-all duration-200 rounded-xl cursor-pointer"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <span
            className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background pointer-events-none"
            aria-hidden="true"
          />
        </div>

        <Button label="Generate Report" backgroundColor="bg-primary" />
      </div>
    </header>
  );
}
