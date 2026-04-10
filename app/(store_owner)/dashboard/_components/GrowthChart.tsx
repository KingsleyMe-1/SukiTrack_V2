"use client";

import { useEffect, useState } from "react";
import { cn } from "@/app/utils/cn";
import { formatPHP } from "@/app/utils/format";
import { WeeklyBarData } from "@/app/types/dashboard";

interface GrowthChartProps {
  bars: WeeklyBarData[];
}

export function GrowthChart({ bars }: GrowthChartProps) {
  // Start all bars at 0 height; animate to real values after mount
  const [heights, setHeights] = useState<number[]>(bars.map(() => 0));

  useEffect(() => {
    // A 60ms delay ensures the initial zero-height render has painted,
    // so the CSS bar-transition actually fires.
    const timer = setTimeout(() => {
      setHeights(bars.map((b) => b.heightPercent));
    }, 60);
    return () => clearTimeout(timer);
  }, [bars]);

  return (
    <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-outline-variant/20 shadow-premium">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-10 md:mb-12 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-on-surface">
            Growth Performance
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Transaction volume trend for the current week
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center space-x-6 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
              Revenue
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Avg. Target
            </span>
          </div>
        </div>
      </div>

      {/* Chart
          - The outer div has a fixed height (responsive via Tailwind).
          - Each column uses self-stretch so it takes the full cross-axis height,
            making height:% on the bar div work correctly.
          - justify-end pushes the bar to the bottom of each column.                    */}
      <div className="h-48 sm:h-56 md:h-64 flex gap-2 sm:gap-4 px-2">
        {bars.map((bar, i) => (
          <div
            key={bar.label}
            className="flex-1 self-stretch flex flex-col justify-end items-center group relative"
          >
            {/* Bar */}
            <div
              className={cn(
                "w-full rounded-t-xl bar-transition relative",
                bar.isToday
                  ? "editorial-gradient"
                  : bar.isFuture
                  ? "bg-surface-container-low"
                  : "bg-surface-container-high"
              )}
              style={{ height: `${heights[i]}%` }}
            >
              {/* Hover tint for past bars */}
              {!bar.isToday && !bar.isFuture && (
                <div className="absolute inset-0 rounded-t-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              {/* Today's tooltip — inside bar so it moves with the height animation */}
              {bar.isToday && heights[i] > 0 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center space-x-1 whitespace-nowrap z-10 pointer-events-none">
                  <span>
                    {bar.value !== undefined ? formatPHP(bar.value) : ""}
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "10px" }}
                  >
                    check_circle
                  </span>
                </div>
              )}
            </div>

            {/* Day label */}
            <span
              className={cn(
                "mt-4 md:mt-6 text-[9px] md:text-[10px] font-bold uppercase tracking-widest",
                bar.isToday
                  ? "text-primary"
                  : bar.isFuture
                  ? "text-on-surface-variant/20"
                  : "text-on-surface-variant/40"
              )}
            >
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
