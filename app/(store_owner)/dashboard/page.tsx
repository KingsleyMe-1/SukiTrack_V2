import type { Metadata } from "next";
import { GreetingBanner } from "./_components/GreetingBanner";
import { StatsGrid } from "./_components/StatsGrid";
import { GrowthChart } from "./_components/GrowthChart";
import { StockAlerts } from "./_components/StockAlerts";
import { ActivityFeed } from "./_components/ActivityFeed";
import type {
  StatsGridProps,
  WeeklyBarData,
  StockAlert,
  ActivityItem,
} from "@/app/types/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | SukiTrack",
  description: "Your store analytics at a glance.",
};

// ── Mock data stubs ──────────────────────────────────────────────────────────
// Shaped identically to future Supabase query return types.
// Replace each constant with an async server fetch when the data layer is ready.

const mockStats: StatsGridProps = {
  totalRevenue: 14280,
  revenueChangePercent: 12.4,
  outstandingCredit: 3450,
  creditRiskLevel: "High Risk",
  creditAccountCount: 11,
};

const mockBars: WeeklyBarData[] = [
  { label: "Mon", heightPercent: 45, isToday: false, isFuture: false, value: 8200 },
  { label: "Tue", heightPercent: 60, isToday: false, isFuture: false, value: 10500 },
  { label: "Wed", heightPercent: 55, isToday: false, isFuture: false, value: 9800 },
  { label: "Today", heightPercent: 90, isToday: true, isFuture: false, value: 14280 },
  { label: "Thu", heightPercent: 70, isToday: false, isFuture: true },
  { label: "Fri", heightPercent: 65, isToday: false, isFuture: true },
  { label: "Sat", heightPercent: 80, isToday: false, isFuture: true },
];

const mockAlerts: StockAlert[] = [
  { name: "Organic Rice (5kg)", status: "critical", count: 2 },
  { name: "Coconut Oil (1L)", status: "out-of-stock" },
  { name: "Tablea Dark Chocolate", status: "low", count: 5 },
  { name: "Refined Sugar", status: "stable" },
];

const mockActivities: ActivityItem[] = [
  {
    id: "act-1",
    type: "order",
    title: "Order #2931 Completed",
    subtitle: "Suki: Maria Santos • 2 mins ago • GCash Payment",
    amount: 1240,
    amountLabel: "Transaction Confirmed",
    isNew: true,
  },
  {
    id: "act-2",
    type: "credit",
    title: "Credit Facility Approval",
    subtitle: "Suki: Robert Lim • 1 hour ago • Auto-generated notice",
    amount: 450,
    amountLabel: "80% Utilization Reach",
  },
  {
    id: "act-3",
    type: "registration",
    title: "New Account: Juan Dela Cruz",
    subtitle: "Registration pending identity verification • 3 hours ago",
    requiresAction: true,
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const activeAlerts = mockAlerts.filter((a) => a.status !== "stable").length;

  return (
    <div className="flex flex-col">
      {/* Greeting banner */}
      <GreetingBanner userName="Arturo" alertCount={activeAlerts} />

      {/* Page content */}
      <div className="px-6 md:px-10 py-6 space-y-8">
        {/* Stats row */}
        <StatsGrid {...mockStats} />

        {/* Visualization row */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <GrowthChart bars={mockBars} />
          <StockAlerts alerts={mockAlerts} />
        </section>

        {/* Activity feed */}
        <ActivityFeed activities={mockActivities} />
      </div>

      {/* Footer */}
      <footer className="mt-auto py-8 md:py-10 px-6 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-outline-variant/10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold opacity-40">
          © 2026 SukiTrack Digital Atelier • Enterprise v2.4.0
        </p>
        <div className="flex space-x-6">
          <a
            href="#"
            className="text-[10px] font-bold text-on-surface-variant/60 hover:text-primary transition-colors uppercase tracking-widest"
          >
            Support
          </a>
          <a
            href="#"
            className="text-[10px] font-bold text-on-surface-variant/60 hover:text-primary transition-colors uppercase tracking-widest"
          >
            Security
          </a>
        </div>
      </footer>
    </div>
  );
}
