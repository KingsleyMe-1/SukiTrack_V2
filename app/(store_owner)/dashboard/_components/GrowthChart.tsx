"use client";

import { useEffect, useState } from "react";
import { cn } from "@/app/utils/cn";
import { formatPHP } from "@/app/utils/format";
import { WeeklyBarData } from "@/app/types/dashboard";

interface GrowthChartProps {
  bars: WeeklyBarData[];
}

export function GrowthChart({ bars }: GrowthChartProps) {
  const [heights, setHeights] = useState<number[]>(bars.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeights(bars.map((b) => b.heightPercent));
    }, 40);
    return () => clearTimeout(timer);
  }, [bars]);

  return (
    <div className="lg:col-span-8 bg-card rounded-3xl p-8 md:p-10 border border-border shadow-premium">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-10 md:mb-12 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Growth Performance
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Transaction volume trend for the current week
          </p>
        </div>
        <div className="flex items-center space-x-6 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
              Revenue
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Avg. Target
            </span>
          </div>
        </div>
      </div>

      <div className="h-48 sm:h-56 md:h-64 flex gap-2 sm:gap-4 px-2">
        {bars.map((bar, i) => (
          <div
            key={bar.label}
            className="flex-1 self-stretch flex flex-col justify-end items-center group relative"
          >
            <div
              className={cn(
                "w-full rounded-t-xl bar-transition relative",
                bar.isToday
                  ? "editorial-gradient"
                  : bar.isFuture
                  ? "bg-secondary"
                  : "bg-accent"
              )}
              style={{ height: `${heights[i]}%` }}
            >
              {!bar.isToday && !bar.isFuture && (
                <div className="absolute inset-0 rounded-t-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              {bar.isToday && heights[i] > 0 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-accent text-foreground border border-border text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center space-x-1 whitespace-nowrap z-10 pointer-events-none">
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

            <span
              className={cn(
                "mt-4 md:mt-6 text-[9px] md:text-[10px] font-bold uppercase tracking-widest",
                bar.isToday
                  ? "text-primary"
                  : bar.isFuture
                  ? "text-muted-foreground/20"
                  : "text-muted-foreground/40"
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
