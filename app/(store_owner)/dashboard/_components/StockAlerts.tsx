import Link from "next/link";
import { cn } from "@/app/utils/cn";
import { StockAlert } from "@/app/types/dashboard";

interface StockAlertsProps {
  alerts: StockAlert[];
}

type AlertStatus = StockAlert["status"];

const statusConfig: Record<
  AlertStatus,
  {
    dot: string;
    badge: string;
    label: (a: StockAlert) => string;
  }
> = {
  critical: {
    dot: "bg-error",
    badge: "bg-error-container/40 text-error",
    label: (a) => `Critical: ${a.count ?? ""}`,
  },
  "out-of-stock": {
    dot: "bg-error",
    badge: "bg-error-container/40 text-error",
    label: () => "Out of Stock",
  },
  low: {
    dot: "bg-warning",
    badge: "bg-warning/20 text-warning",
    label: (a) => `Low: ${a.count ?? ""}`,
  },
  stable: {
    dot: "bg-primary",
    badge: "bg-secondary-container/40 text-primary",
    label: () => "Stable",
  },
};

export function StockAlerts({ alerts }: StockAlertsProps) {
  return (
    <div className="lg:col-span-4 bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-premium flex flex-col">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h3 className="text-lg font-extrabold tracking-tight text-on-surface">
          Stock Alerts
        </h3>
      </div>

      <div className="flex-1 space-y-4 md:space-y-5">
        {alerts.map((alert, i) => {
          const config = statusConfig[alert.status];
          return (
            <div
              key={`${alert.name}-${i}`}
              className={cn(
                "flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0",
                alert.status === "stable" && "opacity-60"
              )}
            >
              <div className="flex items-center space-x-4 overflow-hidden min-w-0">
                <div
                  className={cn("w-2 h-2 rounded-full shrink-0", config.dot)}
                />
                <span className="text-sm font-semibold text-on-surface/80 truncate">
                  {alert.name}
                </span>
              </div>
              <span
                className={cn(
                  "px-3 py-1.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider whitespace-nowrap min-w-[100px] text-center ml-2 shrink-0",
                  config.badge
                )}
              >
                {config.label(alert)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-outline-variant/20">
        <Link
          href="/catalog"
          className="block w-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-bold py-3 md:py-3.5 rounded-xl text-[11px] transition-all duration-300 uppercase tracking-[0.15em] shadow-sm text-center"
        >
          View Full Inventory
        </Link>
      </div>
    </div>
  );
}
