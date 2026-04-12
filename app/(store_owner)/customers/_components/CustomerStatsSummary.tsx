import { formatPHP } from "@/app/utils/format";
import type { Customer } from "@/app/types/customers";

interface CustomerStatsSummaryProps {
  customers: Customer[];
  collectionRate: number;
}

export function CustomerStatsSummary({
  customers,
  collectionRate,
}: CustomerStatsSummaryProps) {
  const totalCredit = customers.reduce((sum, c) => sum + c.creditBalance, 0);
  const highRiskCount = customers.filter(
    (c) => c.creditStatus === "high-risk"
  ).length;

  const avatarCustomers = customers.slice(0, 3);
  const overflowCount = Math.max(0, customers.length - 3);

  const avatarColors = ["bg-primary", "bg-chart-3", "bg-warning"];

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      aria-label="Customer credit summary"
    >
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between gap-4 min-h-36">
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          Total Outstanding Credit
        </p>
        <p className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          {formatPHP(totalCredit)}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {avatarCustomers.map((c, i) => (
              <div
                key={c.id}
                className={`w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-black text-white ${avatarColors[i % avatarColors.length]}`}
                title={c.name}
              >
                {c.initials}
              </div>
            ))}
            {overflowCount > 0 && (
              <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[9px] font-black text-muted-foreground">
                +{overflowCount}
              </div>
            )}
          </div>
          {highRiskCount > 0 && (
            <p className="text-[11px] text-muted-foreground font-medium">
              <span className="font-bold text-destructive">{highRiskCount}</span>{" "}
              customer{highRiskCount !== 1 ? "s" : ""} reached high risk limit
            </p>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between gap-4 min-h-36">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">trending_up</span>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            Monthly Collection
          </p>
        </div>
        <p className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          {collectionRate}%
        </p>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${collectionRate}%` }}
            role="progressbar"
            aria-valuenow={collectionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${collectionRate}% monthly collection rate`}
          />
        </div>
      </div>
    </section>
  );
}
