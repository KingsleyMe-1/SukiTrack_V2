import { cn } from "@/app/utils/cn";
import type { StockStatus } from "@/app/types/inventory";

const badgeConfig: Record<
  StockStatus,
  { label: string; className: string }
> = {
  healthy: {
    label: "Healthy",
    className: "bg-accent text-primary",
  },
  "low-stock": {
    label: "Low Stock",
    className: "bg-warning/10 text-warning",
  },
  "out-of-stock": {
    label: "Out of Stock",
    className: "bg-destructive/10 text-destructive",
  },
};

export function StatusBadge({ status }: { status: StockStatus }) {
  const { label, className } = badgeConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
        className
      )}
    >
      {label}
    </span>
  );
}
