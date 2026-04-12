import { cn } from "@/app/utils/cn";
import { formatPHP } from "@/app/utils/format";
import type { Customer, CustomerCreditStatus } from "@/app/types/customers";
import Image from "next/image";

const statusConfig: Record<
  CustomerCreditStatus,
  { label: string; className: string }
> = {
  "high-risk": {
    label: "HIGH RISK",
    className: "bg-destructive/15 text-destructive",
  },
  stable: {
    label: "STABLE",
    className: "bg-primary/10 text-primary",
  },
  "due-soon": {
    label: "DUE SOON",
    className: "bg-warning/15 text-warning",
  },
  new: {
    label: "NEW",
    className: "bg-accent text-primary",
  },
};

function CustomerAvatar({ customer }: { customer: Customer }) {
  if (customer.avatarUrl) {
    return (
      <Image
        src={customer.avatarUrl}
        alt={customer.name}
        width={48}
        height={48}
        className="w-12 h-12 rounded-xl object-cover shrink-0"
      />
    );
  }
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-black text-white",
        customer.avatarColorClass
      )}
    >
      {customer.initials}
    </div>
  );
}

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const { label: statusLabel, className: statusClassName } =
    statusConfig[customer.creditStatus];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">

      <div className="flex items-start gap-3">
        <CustomerAvatar customer={customer} />
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-sm text-foreground leading-tight truncate">
            {customer.name}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {customer.phone}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full",
            statusClassName
          )}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Credit Balance
          </p>
          <p className="font-black text-base text-primary tracking-tight">
            {formatPHP(customer.creditBalance)}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Last Purchase
          </p>
          <p className="font-semibold text-xs text-foreground">
            {customer.lastPurchase}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <button
          className="flex-1 py-2 rounded-xl border border-border text-muted-foreground text-[11px] font-bold hover:bg-muted/50 hover:text-foreground active:scale-95 transition-all cursor-pointer"
          aria-label={`View ledger for ${customer.name}`}
        >
          View Ledger
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95 transition-all cursor-pointer"
          aria-label={`More options for ${customer.name}`}
        >
          <span className="material-symbols-outlined text-base">more_horiz</span>
        </button>
      </div>
    </div>
  );
}
