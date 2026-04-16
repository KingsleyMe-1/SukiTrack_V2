"use client";

import { cn } from "@/app/utils/cn";
import type { StockStatus, InventoryCategory, StoreOption } from "@/app/types/inventory";
import { SelectDropdown } from "@/app/components/ui/SelectDropdown";

interface FilterBarProps {
  statusFilters: { label: string; value: StockStatus | "all" }[];
  selectedStatus: StockStatus | "all";
  onStatusChange: (status: StockStatus | "all") => void;
  categories: InventoryCategory[];
  selectedCategory: InventoryCategory | "All Categories";
  onCategoryChange: (category: InventoryCategory | "All Categories") => void;
  stores: StoreOption[];
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
}

export function FilterBar({
  statusFilters,
  selectedStatus,
  onStatusChange,
  categories,
  selectedCategory,
  onCategoryChange,
  stores,
  selectedStoreId,
  onStoreChange,
}: FilterBarProps) {
  const storeOptions = [
    { value: "all", label: "All Stores" },
    ...stores.map((s) => ({ value: s.id, label: s.name })),
  ];

  const categoryOptions = [
    { value: "All Categories", label: "All Categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const statusOptions = statusFilters.map((f) => ({
    value: f.value as string,
    label: f.label,
  }));

  return (
    <div className="bg-card rounded-2xl px-4 md:px-6 py-4 border border-border shadow flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 md:gap-6 md:gap-y-3">

      <div className="md:hidden flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap shrink-0">
          Store:
        </span>
        <SelectDropdown
          options={storeOptions}
          value={selectedStoreId}
          onChange={onStoreChange}
          className="flex-1"
        />
      </div>

      <div className="md:hidden flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap shrink-0">
          Filter Status:
        </span>
        <SelectDropdown
          options={statusOptions}
          value={selectedStatus}
          onChange={(v) => onStatusChange(v as StockStatus | "all")}
        />
      </div>

      <div className="md:hidden flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          Category:
        </span>
        <SelectDropdown
          options={categoryOptions}
          value={selectedCategory}
          onChange={(v) => onCategoryChange(v as InventoryCategory | "All Categories")}
        />
      </div>

      <div className="hidden md:flex items-center gap-1.5 sm:gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          Filter Status:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap",
                selectedStatus === value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block h-6 w-px bg-border" />

      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
            Store:
          </span>
          <SelectDropdown
            options={storeOptions}
            value={selectedStoreId}
            onChange={onStoreChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
            Category:
          </span>
          <SelectDropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={(v) => onCategoryChange(v as InventoryCategory | "All Categories")}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
