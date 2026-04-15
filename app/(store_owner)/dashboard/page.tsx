import type { Metadata } from "next";
import { createClient } from "@/app/utils/supabase/server";
import {
  getDashboardStats,
  getStockAlerts,
  getWeeklyBars,
  getRecentActivities,
} from "@/app/data/supabase/dashboard";
import { GreetingBanner } from "./_components/GreetingBanner";
import { StatsGrid } from "./_components/StatsGrid";
import { GrowthChart } from "./_components/GrowthChart";
import { StockAlerts } from "./_components/StockAlerts";
import { ActivityFeed } from "./_components/ActivityFeed";

export const metadata: Metadata = {
  title: "Dashboard | SukiTrack",
  description: "Your store analytics at a glance.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ownerId = user!.id;

  const [stats, stockAlerts, weeklyBars, activities] = await Promise.all([
    getDashboardStats(ownerId),
    getStockAlerts(ownerId),
    getWeeklyBars(ownerId),
    getRecentActivities(ownerId),
  ]);

  const userName =
    (user!.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user!.email?.split("@")[0] ??
    "Owner";

  const activeAlerts = stockAlerts.filter((a) => a.status !== "stable").length;

  return (
    <div className="flex flex-col">
      <GreetingBanner userName={userName} alertCount={activeAlerts} />

      <div className="px-6 md:px-10 py-6 space-y-8">
        <StatsGrid {...stats} />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <GrowthChart bars={weeklyBars} />
          <StockAlerts alerts={stockAlerts} />
        </section>

        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}
