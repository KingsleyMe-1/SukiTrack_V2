import { cn } from "@/app/utils/cn";
import { formatPHP } from "@/app/utils/format";
import type { ManagedStore, StoreStatus, StockLevelStatus } from "@/app/types/stores";

const statusConfig: Record<StoreStatus, { label: string; className: string }> = {
  active: {
    label: "ACTIVE",
    className: "bg-primary/10 text-primary",
  },
  "ongoing-maintenance": {
    label: "ONGOING MAINTENANCE",
    className: "bg-warning/10 text-warning",
  },
  closed: {
    label: "CLOSED",
    className: "bg-destructive/10 text-destructive",
  },
};

const stockConfig: Record<StockLevelStatus, { barClass: string; textClass: string; label: string }> = {
  optimal: {
    barClass: "bg-primary",
    textClass: "text-primary",
    label: "Optimal",
  },
  "low-stock": {
    barClass: "bg-destructive",
    textClass: "text-destructive",
    label: "Low Stock",
  },
  full: {
    barClass: "bg-warning",
    textClass: "text-warning",
    label: "Full",
  },
};

function CreditAvatar({ initials, colorClass }: { initials: string; colorClass: string }) {
  return (
    <div
      className={cn(
        "w-7 h-7 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold text-white shrink-0",
        colorClass
      )}
    >
      {initials}
    </div>
  );
}

interface StoreCardProps {
  store: ManagedStore;
}

export function StoreCard({ store }: StoreCardProps) {
  const { label: statusLabel, className: statusClassName } = statusConfig[store.status];
  const { barClass, textClass, label: stockLabel } = stockConfig[store.stockLevelStatus];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">

      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-2xl">
            {store.icon}
          </span>
        </div>
        <span
          className={cn(
            "text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full",
            statusClassName
          )}
        >
          {statusLabel}
        </span>
      </div>

      <div>
        <h3 className="font-extrabold text-base text-foreground leading-tight">
          {store.name}
        </h3>
        <p className="flex items-center gap-1 mt-1 text-muted-foreground text-[11px] font-medium">
          <span className="material-symbols-outlined text-sm">location_on</span>
          {store.location}
        </p>
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          Today&apos;s Sales
        </p>
        <p className="font-black text-xl text-primary tracking-tight">
          {formatPHP(store.todaysSales)}
        </p>
      </div>

      <div className="border-t border-border/60" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Active Credits
          </p>
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
              {store.creditAccounts.map((account, i) => (
                <CreditAvatar key={i} initials={account.initials} colorClass={account.colorClass} />
              ))}
            </div>
            {store.extraCreditCount > 0 && (
              <span className="ml-1 text-[9px] font-black text-muted-foreground">
                +{store.extraCreditCount}
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Stock Level
          </p>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-1.5">
            <div
              className={cn("h-full rounded-full", barClass)}
              style={{ width: `${store.stockLevelPercent}%` }}
            />
          </div>
          <p className={cn("text-[9px] font-black uppercase tracking-wider", textClass)}>
            {store.stockLevelPercent}% {stockLabel}
          </p>
        </div>
      </div>

      <button
        className="w-full mt-auto py-2.5 rounded-xl border border-primary/30 text-primary text-xs font-bold hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
        aria-label={`Manage ${store.name}`}
      >
        Manage Store
      </button>
    </div>
  );
}
