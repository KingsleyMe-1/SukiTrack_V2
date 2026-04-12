"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/app/utils/cn";
import type { StockStatus, InventoryCategory } from "@/app/types/inventory";

interface FilterBarProps {
    statusFilters: { label: string; value: StockStatus | "all" }[];
    selectedStatus: StockStatus | "all";
    onStatusChange: (status: StockStatus | "all") => void;
    categories: InventoryCategory[];
    selectedCategory: InventoryCategory | "All Categories";
    onCategoryChange: (category: InventoryCategory | "All Categories") => void;
}

export function FilterBar({
    statusFilters,
    selectedStatus,
    onStatusChange,
    categories,
    selectedCategory,
    onCategoryChange,
}: FilterBarProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allOptions: (InventoryCategory | "All Categories")[] = ["All Categories", ...categories];

    return (
        <div className="bg-card rounded-2xl px-4 md:px-6 py-4 border border-border shadow flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 md:gap-6 md:gap-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
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

            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    Category:
                </span>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer min-w-[130px]",
                            open
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-muted/40 text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                        )}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                    >
                        <span className="flex-1 text-left truncate">{selectedCategory}</span>
                        <span
                            className={cn(
                                "material-symbols-outlined text-base transition-transform duration-200",
                                open ? "rotate-180" : "rotate-0"
                            )}
                            aria-hidden="true"
                        >
                            keyboard_arrow_down
                        </span>
                    </button>

                    {open && (
                        <div
                            role="listbox"
                            className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[160px] rounded-xl border border-primary/30 bg-card shadow-lg overflow-hidden"
                        >
                            <div className="h-0.5 bg-primary/60 w-full" />
                            <div className="py-1">
                                {allOptions.map((option) => {
                                    const isSelected = selectedCategory === option;
                                    return (
                                        <button
                                            key={option}
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => {
                                                onCategoryChange(option);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-[11px] font-semibold transition-colors cursor-pointer",
                                                isSelected
                                                    ? "bg-primary/15 text-primary"
                                                    : "text-foreground/70 hover:bg-primary/10 hover:text-primary"
                                            )}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="md:ml-auto flex items-center gap-2 text-muted-foreground/60">
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                    Last Sync: 5 mins ago
                </span>
                <span
                    className="material-symbols-outlined text-base cursor-pointer hover:rotate-180 transition-transform duration-500"
                    aria-hidden="true"
                >
                    sync
                </span>
            </div>
        </div>
    );
}

export default FilterBar;