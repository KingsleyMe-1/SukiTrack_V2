import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/app/components/ui/GlassCard";

const floatingBadges = [
  {
    className: "absolute -top-6 -right-6 md:-top-8 md:-right-8 animate-float z-10",
    content: (
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-xl md:text-2xl font-bold">trending_up</span>
        </div>
        <div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface/60">Monthly Growth</p>
          <p className="text-lg md:text-xl font-extrabold text-on-surface tracking-tight">+24.8%</p>
        </div>
      </div>
    ),
    style: {},
  },
  {
    className: "absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 animate-float z-10",
    content: (
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-tertiary/20 flex items-center justify-center text-tertiary shrink-0">
          <span className="material-symbols-outlined text-xl md:text-2xl">account_balance_wallet</span>
        </div>
        <div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface/60">Today's Sales</p>
          <p className="text-lg md:text-xl font-extrabold text-on-surface tracking-tight">₱4,820.00</p>
        </div>
      </div>
    ),
    style: { animationDelay: "-3s" },
  },
];

export function HeroSection() {
  return (
    <section className="relative px-6 md:px-8 py-14 md:py-24 max-w-7xl mx-auto overflow-visible">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px] tracking-widest uppercase">
            <span className="mr-1.5">✨</span> Modernizing Sari-Sari Stores
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-on-surface leading-[1.08] tracking-tight">
            Track every peso,{" "}
            <br className="hidden sm:block" />
            <span className="hero-gradient-text">grow every day.</span>
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-md leading-relaxed font-medium">
            SukiTrack is the intelligent companion for Philippine store owners. Manage inventory, track credit, and understand your profits in real-time.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/login"
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-7 py-3.5 rounded-full font-bold text-sm md:text-base hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Get Started
            </Link>
            <button className="px-7 py-3.5 rounded-full font-semibold text-sm md:text-base text-on-surface border border-on-surface/20 hover:bg-surface-container-low transition-all active:scale-95">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative animate-fade-in-up animation-delay-200 mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-square shadow-2xl bg-surface-container border-4 border-white/50 dark:border-white/5">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhbdZi9JOd69MmZhD0XNz9X6rzDwXp9DIIsR0vqw194-2S4dL3FAFY1CMpLVuNd-7gcgk_0YhC9x0tu9FA2Q3VFInoAccRjDfGik4INirxyGQhvkOx8XmiWogYNuI452lk8lUj3TVlGnlbaBgMrhslV-_pU_AEhnDNpO0NSEwNs1yGLTN87Kw1JJIsLo3OQ1TJrI03aY9IG16EO8IjjNX6IFOXudB0q16jlFnqyFApJ6ssDrialOocUdIrKhHc_39-kJOdBlypXXKr"
              alt="Vibrant Filipino sari-sari store"
              fill
              className="object-cover hover:scale-110 transition-transform duration-1000 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
            />
          </div>

          {floatingBadges.map((badge, i) => (
            <GlassCard
              key={i}
              className={`${badge.className} p-4 md:p-5 rounded-2xl shadow-2xl`}
              style={badge.style}
            >
              {badge.content}
            </GlassCard>
          ))}

          <GlassCard className="absolute top-1/2 -right-10 md:-right-12 px-5 py-3 rounded-full shadow-xl flex items-center gap-3 -translate-y-1/2 z-10 hover:translate-x-2 transition-transform cursor-default">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-sm md:text-base font-bold">inventory_2</span>
            </div>
            <p className="text-xs md:text-sm font-bold text-on-surface tracking-tight whitespace-nowrap">Low Stock Alert</p>
          </GlassCard>

          <GlassCard className="absolute top-10 md:top-12 -left-8 md:-left-10 px-5 py-3 rounded-full shadow-xl flex items-center gap-3 z-10">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-on-surface uppercase tracking-[0.2em] whitespace-nowrap">Live Updates</span>
          </GlassCard>

          <GlassCard className="absolute bottom-16 md:bottom-20 -right-10 md:-right-14 p-4 md:p-5 rounded-2xl shadow-2xl flex flex-col items-start gap-1 z-10 animate-bounce-slow">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface/60">Listahan Balance</p>
            <p className="text-lg md:text-xl font-extrabold text-primary tracking-tight">₱120.00</p>
          </GlassCard>

          <GlassCard className="absolute top-2/3 -left-10 md:-left-14 p-3 md:p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-10 hover:-translate-x-2 transition-transform cursor-default">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <span className="material-symbols-outlined text-lg md:text-xl">location_on</span>
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-bold uppercase text-on-surface/50 tracking-wider">Nearby Store</p>
              <p className="text-xs md:text-sm font-extrabold text-on-surface whitespace-nowrap">Aling Nena's</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
