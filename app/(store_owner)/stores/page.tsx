import type { Metadata } from "next";
import { StoreCard } from "./_components/StoreCard";
import { MarketIntelligenceBanner } from "./_components/MarketIntelligenceBanner";
import { Footer } from "@/app/components/landing/Footer";
import type { ManagedStore } from "@/app/types/stores";

export const metadata: Metadata = {
  title: "Managed Stores | SukiTrack",
  description: "Oversee and manage all your store locations from one place.",
};

const mockStores: ManagedStore[] = [
  {
    id: "store-001",
    name: "Suki Central",
    location: "Quezon City, PH",
    status: "active",
    icon: "storefront",
    todaysSales: 42850,
    creditAccounts: [
      { initials: "MR", colorClass: "bg-primary" },
      { initials: "JL", colorClass: "bg-warning" },
    ],
    extraCreditCount: 12,
    stockLevelPercent: 88,
    stockLevelStatus: "optimal",
  },
  {
    id: "store-002",
    name: "South Side Branch",
    location: "Alabang, PH",
    status: "ongoing-maintenance",
    icon: "storefront",
    todaysSales: 0,
    creditAccounts: [
      { initials: "PO", colorClass: "bg-destructive" },
    ],
    extraCreditCount: 4,
    stockLevelPercent: 42,
    stockLevelStatus: "low-stock",
  },
  {
    id: "store-003",
    name: "East Plaza Pop-up",
    location: "Pasig City, PH",
    status: "active",
    icon: "storefront",
    todaysSales: 12300.5,
    creditAccounts: [
      { initials: "AR", colorClass: "bg-primary" },
      { initials: "SC", colorClass: "bg-warning" },
    ],
    extraCreditCount: 0,
    stockLevelPercent: 95,
    stockLevelStatus: "full",
  },
];

const activeCount = mockStores.filter((s) => s.status === "active").length;


export default function StoresPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 md:px-10 py-6 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Managed Stores
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You are currently overseeing{" "}
              <span className="text-primary font-bold">
                {activeCount} active location{activeCount !== 1 ? "s" : ""}
              </span>{" "}
              across Metro Manila.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all cursor-pointer whitespace-nowrap self-start">
            <span className="material-symbols-outlined text-sm">add_business</span>
            Add New Store
          </button>
        </div>

        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-label="Store locations"
        >
          {mockStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </section>

        <MarketIntelligenceBanner />

      </div>
      <Footer />
    </div>
  );
}
