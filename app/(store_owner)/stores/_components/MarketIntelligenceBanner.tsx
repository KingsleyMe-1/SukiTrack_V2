export function MarketIntelligenceBanner() {
  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col lg:flex-row">

      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">

        <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="material-symbols-outlined text-primary text-sm">neurology</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">
            Market Intelligence
          </span>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
            Expansion Opportunity in{" "}
            <em className="not-italic text-primary font-extrabold">BGC, Taguig</em>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
            Our data shows a{" "}
            <strong className="font-bold text-foreground">24% increase</strong>{" "}
            in grocery delivery demand in your neighboring district. Your supply
            chain is already optimized for this route.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer">
            Analyze Market Data
          </button>
          <button className="text-muted-foreground text-xs font-bold hover:text-foreground transition-colors cursor-pointer">
            Not Now
          </button>
        </div>
      </div>

      <div
        className="relative min-h-48 lg:w-80 xl:w-96 flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: "#0a1f15",
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.15)_0%,transparent_70%)]" />

        <div className="relative z-10 bg-card/90 backdrop-blur-sm rounded-2xl px-6 py-5 text-center shadow-xl border border-border/50">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Potential ROI
          </p>
          <p className="text-3xl font-extrabold text-primary tracking-tight">
            +32%
          </p>
        </div>
      </div>
    </div>
  );
}
