import { eq, ne, lt, and, count, sum } from "drizzle-orm";
import { db } from "@/app/db";
import { inventoryItems, customers, stores } from "@/app/db/schema";
import type { StatsGridProps, StockAlert, WeeklyBarData, ActivityItem } from "@/app/types/dashboard";

// ── Dashboard Stats ────────────────────────────────────────────────────────

/**
 * Aggregate today's total sales and outstanding credit for a given owner.
 * Replaces the static mockStats object.
 */
export async function getDashboardStats(ownerId: string): Promise<StatsGridProps> {
  const [salesResult] = await db
    .select({ total: sum(stores.todaysSales) })
    .from(stores)
    .where(and(eq(stores.ownerId, ownerId), eq(stores.status, "active")));

  const [creditResult] = await db
    .select({ total: sum(customers.creditBalance) })
    .from(customers)
    .where(eq(customers.ownerId, ownerId));

  const [highRiskResult] = await db
    .select({ total: count() })
    .from(customers)
    .where(and(eq(customers.ownerId, ownerId), eq(customers.creditStatus, "high-risk")));

  const [customerCount] = await db
    .select({ total: count() })
    .from(customers)
    .where(eq(customers.ownerId, ownerId));

  const totalRevenue = Number(salesResult?.total ?? 0);
  const outstandingCredit = Number(creditResult?.total ?? 0);
  const highRiskCount = highRiskResult?.total ?? 0;
  const totalCustomers = customerCount?.total ?? 0;

  const creditRiskLevel =
    highRiskCount > totalCustomers * 0.3
      ? "High Risk"
      : highRiskCount > 0
        ? "Normal"
        : "Low Risk";

  return {
    totalRevenue,
    revenueChangePercent: 0, // requires historical data — extend later
    outstandingCredit,
    creditRiskLevel,
    creditAccountCount: totalCustomers,
  };
}

// ── Stock Alerts ───────────────────────────────────────────────────────────

/** Return inventory items that are out of stock or running low for this owner's stores. */
export async function getStockAlerts(ownerId: string): Promise<StockAlert[]> {
  const LOW_STOCK_THRESHOLD = 20;

  // Subquery the owner's store IDs to scope inventory items
  const ownerStores = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.ownerId, ownerId));
  const storeIds = ownerStores.map((s) => s.id);

  if (storeIds.length === 0) return [];

  const outOfStock = await db
    .select({ name: inventoryItems.name })
    .from(inventoryItems)
    .where(eq(inventoryItems.status, "out-of-stock"));

  const lowStock = await db
    .select({ name: inventoryItems.name, stockCount: inventoryItems.stockCount })
    .from(inventoryItems)
    .where(and(lt(inventoryItems.stockCount, LOW_STOCK_THRESHOLD), ne(inventoryItems.status, "out-of-stock")));

  const alerts: StockAlert[] = [
    ...outOfStock.map((item) => ({
      name: item.name,
      status: "out-of-stock" as const,
    })),
    ...lowStock.map((item) => ({
      name: item.name,
      status: (item.stockCount <= 5 ? "critical" : "low") as StockAlert["status"],
      count: item.stockCount,
    })),
  ];

  return alerts;
}

// ── Weekly Growth Bars ─────────────────────────────────────────────────────

/**
 * Build 7 WeeklyBarData entries (Mon–Sun) for the current week.
 * Today's bar uses the real sum of todaysSales from the owner's stores.
 * Past and future days default to 0 until historical data is available.
 */
export async function getWeeklyBars(ownerId: string): Promise<WeeklyBarData[]> {
  const [result] = await db
    .select({
      totalSales: sum(stores.todaysSales),
      totalTarget: sum(stores.dailyTarget),
    })
    .from(stores)
    .where(and(eq(stores.ownerId, ownerId), eq(stores.status, "active")));

  const todaysSales = Number(result?.totalSales ?? 0);
  const dailyTarget = Number(result?.totalTarget ?? 0);

  // Scale: use dailyTarget as 100%-baseline, fallback to todaysSales itself
  const scale = dailyTarget > 0 ? dailyTarget : (todaysSales > 0 ? todaysSales : 1);

  const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const jsDay = new Date().getDay(); // 0=Sun … 6=Sat
  const todayIndex = (jsDay + 6) % 7; // remap to Mon=0 … Sun=6

  return LABELS.map((label, i) => {
    const isToday = i === todayIndex;
    const isFuture = i > todayIndex;
    return {
      label: isToday ? "Today" : label,
      heightPercent: isToday ? Math.min(100, Math.round((todaysSales / scale) * 100)) : 0,
      isToday,
      isFuture,
      value: isToday ? todaysSales : undefined,
    };
  });
}

// ── Activity Feed ──────────────────────────────────────────────────────────

/**
 * Returns recent activity items.
 * A dedicated transactions / activity table is needed for real data.
 * Until then, returns an empty array so the UI shows an empty state.
 */
export async function getRecentActivities(_ownerId: string): Promise<ActivityItem[]> {
  return [];
}
