import type {
  StatsGridProps,
  WeeklyBarData,
  StockAlert,
  ActivityItem,
} from "@/app/types/dashboard";

export const mockStats: StatsGridProps = {
  totalRevenue: 14280,
  revenueChangePercent: 12.4,
  outstandingCredit: 3450,
  creditRiskLevel: "High Risk",
  creditAccountCount: 11,
};

export const mockWeeklyBars: WeeklyBarData[] = [
  { label: "Mon", heightPercent: 45, isToday: false, isFuture: false, value: 8200 },
  { label: "Tue", heightPercent: 60, isToday: false, isFuture: false, value: 10500 },
  { label: "Wed", heightPercent: 55, isToday: false, isFuture: false, value: 9800 },
  { label: "Today", heightPercent: 90, isToday: true, isFuture: false, value: 14280 },
  { label: "Thu", heightPercent: 70, isToday: false, isFuture: true },
  { label: "Fri", heightPercent: 65, isToday: false, isFuture: true },
  { label: "Sat", heightPercent: 80, isToday: false, isFuture: true },
];

export const mockStockAlerts: StockAlert[] = [
  { name: "Organic Rice (5kg)", status: "critical", count: 2 },
  { name: "Coconut Oil (1L)", status: "out-of-stock" },
  { name: "Tablea Dark Chocolate", status: "low", count: 5 },
  { name: "Refined Sugar", status: "stable" },
];

export const mockActivities: ActivityItem[] = [
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
