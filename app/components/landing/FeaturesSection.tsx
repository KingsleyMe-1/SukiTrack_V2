import Image from "next/image";

const providers = [
  {
    name: "GCash",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" aria-label="GCash" className="w-full h-full">
        <rect width="40" height="40" rx="10" fill="#007DFF" />
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle"
          fontFamily="Arial, sans-serif" fontWeight="800" fontSize="18" fill="white">G
        </text>
      </svg>
    ),
  },
  {
    name: "Maya",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" aria-label="Maya" className="w-full h-full">
        <rect width="40" height="40" rx="10" fill="#00BF63" />
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle"
          fontFamily="Arial, sans-serif" fontWeight="800" fontSize="16" fill="white">M
        </text>
      </svg>
    ),
  },
  {
    name: "GoTyme",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" aria-label="GoTyme" className="w-full h-full">
        <rect width="40" height="40" rx="10" fill="#FF5C3A" />
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle"
          fontFamily="Arial, sans-serif" fontWeight="800" fontSize="13" fill="white">GT
        </text>
      </svg>
    ),
  },
] as const;
const stockBars = [65, 100, 40, 80, 25, 90, 55] as const;

export function FeaturesSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">

      {/* ── Section header — asymmetric split ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12 md:mb-14">
        <div>
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary mb-3">
            Platform Features
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-[1.1]">
            Every tool you need,
            <br />
            <span className="text-on-surface/35">nothing you don&apos;t.</span>
          </h2>
        </div>
        <p className="text-sm text-on-surface-variant font-medium max-w-xs leading-relaxed md:text-right shrink-0">
          Purpose-built for Philippine sari-sari stores.
          <br className="hidden md:block" /> Simple by design, powerful by nature.
        </p>
      </div>

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

        {/* 01 — Smart Credit Ledger (wide, col-span-2) */}
        <div className="md:col-span-2 bg-surface-container-low rounded-3xl p-7 md:p-9 flex flex-col overflow-hidden group border border-on-surface/5 hover:border-primary/20 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface/30">
              <span className="w-4 h-px bg-on-surface/20 inline-block" />
              01 &middot; Credit
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-sm">receipt_long</span>
            </div>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight mb-2">Smart Credit Ledger</h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-sm mb-6">
            Track every &ldquo;utang&rdquo; digitally. Automated SMS reminders collect
            payments &mdash; no awkward conversations needed.
          </p>
          {/* Image with gradient + live stat overlay */}
          <div className="relative mt-auto rounded-2xl overflow-hidden ring-1 ring-on-surface/8">
            <Image
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=90&auto=format&fit=crop"
              alt="Credit Ledger Dashboard"
              width={800}
              height={300}
              className="w-full h-44 md:h-52 object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              unoptimized
            />
            {/* Bottom scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/70 via-transparent to-transparent pointer-events-none" />
            {/* Live stat badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-surface-container-low/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-semibold text-on-surface whitespace-nowrap">
                &#8369;18,400 collected this month
              </span>
            </div>
          </div>
        </div>

        {/* 02 — QR Payments (dark tall, spans 2 rows) */}
        <div className="md:row-span-2 bg-emphasis-surface rounded-3xl p-7 md:p-9 flex flex-col relative overflow-hidden group border border-emphasis-accent/8 hover:border-emphasis-accent/25 transition-all duration-300">
          {/* Ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-emphasis-accent/8 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-emphasis-accent/40">
            <span className="w-4 h-px bg-emphasis-accent/20 inline-block" />
            02 &middot; Payments
          </span>

          {/* Icon centrepiece */}
          <div className="flex-1 flex items-center justify-center py-10">
            <div className="relative">
              <div className="w-36 h-36 bg-emphasis-accent/8 rounded-[2.25rem] flex items-center justify-center ring-1 ring-emphasis-accent/15 group-hover:bg-emphasis-accent/14 group-hover:ring-emphasis-accent/30 transition-all duration-500">
                <span className="material-symbols-outlined text-[5rem] text-emphasis-accent">qr_code_2</span>
              </div>
              {/* Expanding ring on hover */}
              <span className="absolute inset-0 rounded-[2.25rem] ring-1 ring-emphasis-accent/15 scale-100 group-hover:scale-[1.2] group-hover:opacity-0 transition-all duration-500 pointer-events-none" />
              {/* Check badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emphasis-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[13px] text-emphasis-surface font-bold">check</span>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-emphasis-on-surface mb-2">QR Payments</h3>
          <p className="text-sm text-emphasis-on-surface/55 font-medium leading-relaxed mb-5">
            Accept popular Philippine e-wallets and bank transfers in seconds.
          </p>

          {/* Provider logos */}
          <div className="flex items-center gap-3 mb-5">
            {providers.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-sm">
                  {p.logo}
                </div>
                <span className="text-[9px] font-bold text-emphasis-on-surface/40 tracking-wide uppercase">
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          {/* Zero-fee callout */}
          <div className="rounded-2xl bg-emphasis-accent/6 border border-emphasis-accent/10 px-4 py-3 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-sm text-emphasis-accent shrink-0">workspace_premium</span>
            <span className="text-xs font-bold text-emphasis-on-surface/80">
              &#8369;0 transaction fees, always.
            </span>
          </div>
        </div>

        {/* 03 — Inventory Sync */}
        <div className="bg-surface-container-low rounded-3xl p-7 md:p-9 flex flex-col group border border-on-surface/5 hover:border-secondary/25 transition-all duration-300">
          <div className="flex items-start justify-between mb-6">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface/30">
              <span className="w-4 h-px bg-on-surface/20 inline-block" />
              03 &middot; Inventory
            </span>
            <div className="w-8 h-8 rounded-xl bg-secondary-container/70 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
            </div>
          </div>

          {/* CSS bar-chart visual */}
          <div className="flex items-end gap-1.5 h-10 mb-6" aria-hidden="true">
            {stockBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-opacity duration-300 opacity-60 group-hover:opacity-100"
                style={{
                  height: `${h}%`,
                  background:
                    h < 35
                      ? "var(--color-tertiary-container)"
                      : "var(--color-secondary-fixed-dim)",
                }}
              />
            ))}
          </div>

          <h3 className="text-lg font-extrabold tracking-tight mb-1.5">Inventory Sync</h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
            Real-time low-stock alerts so you never lose a sale.
          </p>
        </div>

        {/* 04 — Profit Insights */}
        <div className="bg-surface-container-low rounded-3xl p-7 md:p-9 flex flex-col group border border-on-surface/5 hover:border-tertiary/25 transition-all duration-300">
          <div className="flex items-start justify-between mb-6">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface/30">
              <span className="w-4 h-px bg-on-surface/20 inline-block" />
              04 &middot; Analytics
            </span>
            <div className="w-8 h-8 rounded-xl bg-tertiary-fixed-dim/50 flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-sm">monitoring</span>
            </div>
          </div>

          {/* SVG sparkline */}
          <svg
            viewBox="0 0 120 36"
            aria-hidden="true"
            preserveAspectRatio="none"
            className="w-full mb-4"
            style={{ height: "36px" }}
          >
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-tertiary-fixed-dim)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--color-tertiary-fixed-dim)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points="0,32 20,26 40,30 60,16 80,20 100,8 120,12 120,36 0,36"
              fill="url(#sparkGrad)"
            />
            <polyline
              points="0,32 20,26 40,30 60,16 80,20 100,8 120,12"
              fill="none"
              stroke="var(--color-tertiary-fixed-dim)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Big stat */}
          <div className="mb-4">
            <p className="text-2xl font-extrabold text-on-surface tracking-tight leading-none">+24.8%</p>
            <p className="text-xs text-on-surface-variant font-medium mt-1">avg. monthly margin growth</p>
          </div>

          <h3 className="text-lg font-extrabold tracking-tight mb-1.5">Profit Insights</h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
            Know your best-sellers and true daily margin.
          </p>
        </div>

      </div>
    </section>
  );
}
