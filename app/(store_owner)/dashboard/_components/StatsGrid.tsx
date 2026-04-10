import { StatsGridProps } from "@/app/types/dashboard";
import { formatPHP } from "@/app/utils/format";

export function StatsGrid({
  totalRevenue,
  revenueChangePercent,
  outstandingCredit,
  creditRiskLevel,
  creditAccountCount,
}: StatsGridProps) {
  const isIncrease = revenueChangePercent >= 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* ── Total Revenue Card ─────────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-3 p-8 md:p-10 rounded-3xl editorial-gradient text-on-primary flex flex-col justify-between min-h-[220px] md:min-h-[260px] relative overflow-hidden group">
        <div className="absolute top-8 right-8 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
          <span className="material-symbols-outlined text-xl">payments</span>
        </div>
        <div className="pr-16">
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-bold">
            Total Revenue Today
          </span>
          <div className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 tracking-tighter">
            {formatPHP(totalRevenue)}
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/5 group-hover:bg-white/20 transition-all duration-300">
          <span className="material-symbols-outlined text-sm">
            {isIncrease ? "trending_up" : "trending_down"}
          </span>
          <span>
            {Math.abs(revenueChangePercent)}%{" "}
            {isIncrease ? "increase" : "decrease"} vs yesterday
          </span>
        </div>
      </div>

      {/* ── Outstanding Credit Card ─────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/30 shadow-premium flex flex-col justify-between min-h-[220px] md:min-h-[260px] relative">
        <div className="absolute top-8 right-8 w-10 h-10 bg-tertiary/5 text-tertiary rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">
            account_balance_wallet
          </span>
        </div>
        <div className="pr-16">
          <span className="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
            Outstanding Credit
          </span>
          <div className="text-3xl md:text-4xl lg:text-5xl font-black mt-4 text-on-surface tracking-tight">
            {formatPHP(outstandingCredit)}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Stacked avatars */}
          <div className="flex -space-x-1.5">
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-surface-container-lowest shadow-sm" />
            <div className="w-8 h-8 rounded-full bg-secondary-container border-2 border-surface-container-lowest shadow-sm" />
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed border-2 border-surface-container-lowest shadow-sm" />
            {creditAccountCount > 3 && (
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-black border-2 border-surface-container-lowest shadow-sm">
                +{creditAccountCount - 3}
              </div>
            )}
          </div>
          {/* Risk badge */}
          <div className="bg-tertiary/5 px-4 py-2 rounded-xl flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            <span className="text-[11px] font-black text-tertiary uppercase tracking-wider">
              {creditRiskLevel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
