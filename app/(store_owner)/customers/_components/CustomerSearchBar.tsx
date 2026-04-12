"use client";

import { cn } from "@/app/utils/cn";
import type { CustomerCreditStatus } from "@/app/types/customers";

const QUICK_FILTERS: { label: string; value: CustomerCreditStatus }[] = [
  { label: "High Credit", value: "high-risk" },
  { label: "Due Soon", value: "due-soon" },
];

interface CustomerSearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeFilter: CustomerCreditStatus | "all";
  onFilterChange: (f: CustomerCreditStatus | "all") => void;
}

export function CustomerSearchBar({
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
}: CustomerSearchBarProps) {
  function toggleFilter(value: CustomerCreditStatus) {
    onFilterChange(activeFilter === value ? "all" : value);
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none">
          search
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, phone, or utang status..."
          aria-label="Search customers"
          className="w-full pl-12 py-5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      <button
        onClick={() => onFilterChange("all")}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
          activeFilter === "all"
            ? "border-primary/30 bg-primary/5 text-primary"
            : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
        )}
        aria-pressed={activeFilter === "all"}
      >
        <span className="material-symbols-outlined text-sm">filter_list</span>
        Filter
      </button>

      {QUICK_FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => toggleFilter(value)}
          className={cn(
            "px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
            activeFilter === value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
          )}
          aria-pressed={activeFilter === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
