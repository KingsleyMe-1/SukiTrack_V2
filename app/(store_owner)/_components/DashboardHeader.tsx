"use client";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 md:px-10 h-20 w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        className="lg:hidden p-2.5 text-on-surface-variant hover:bg-surface-container rounded-xl transition-all active:scale-90"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Desktop spacer */}
      <div className="hidden lg:block" aria-hidden="true" />

      {/* Right actions */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <div className="relative">
          <button
            aria-label="View notifications"
            className="p-2.5 text-on-surface-variant hover:bg-surface-container-lowest hover:shadow-sm transition-all duration-200 rounded-xl"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <span
            className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* CTA */}
        <button className="ml-2 bg-primary text-on-primary text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          Generate Report
        </button>
      </div>
    </header>
  );
}
