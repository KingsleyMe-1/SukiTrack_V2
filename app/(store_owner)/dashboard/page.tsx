import type { Metadata } from "next";
import { GreetingBanner } from "./_components/GreetingBanner";
import { StatsGrid } from "./_components/StatsGrid";
import { GrowthChart } from "./_components/GrowthChart";
import { StockAlerts } from "./_components/StockAlerts";
import { ActivityFeed } from "./_components/ActivityFeed";
import {
  mockStats,
  mockWeeklyBars,
  mockStockAlerts,
  mockActivities,
} from "@/app/data/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | SukiTrack",
  description: "Your store analytics at a glance.",
};

export default function DashboardPage() {
  const activeAlerts = mockStockAlerts.filter((a) => a.status !== "stable").length;

  return (
    <div className="flex flex-col">
      <GreetingBanner userName="Arturo" alertCount={activeAlerts} />

      <div className="px-6 md:px-10 py-6 space-y-8">
        <StatsGrid {...mockStats} />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <GrowthChart bars={mockWeeklyBars} />
          <StockAlerts alerts={mockStockAlerts} />
        </section>

        <ActivityFeed activities={mockActivities} />
      </div>
    </div>
  );
}
