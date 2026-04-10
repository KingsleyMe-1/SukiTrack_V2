// ── Shared TypeScript interfaces for the Store Owner Dashboard ────────────────

export interface StatsGridProps {
  totalRevenue: number;
  revenueChangePercent: number;
  outstandingCredit: number;
  creditRiskLevel: "High Risk" | "Normal" | "Low Risk";
  creditAccountCount: number;
}

export interface WeeklyBarData {
  /** Display label e.g. "Mon", "Today" */
  label: string;
  /** Bar height as percentage 0–100 of the chart container */
  heightPercent: number;
  isToday: boolean;
  /** Future days are rendered muted */
  isFuture: boolean;
  /** ₱ value shown in today's tooltip */
  value?: number;
}

export interface StockAlert {
  name: string;
  status: "critical" | "out-of-stock" | "low" | "stable";
  /** Remaining units (used for "Critical: N" and "Low: N" labels) */
  count?: number;
}

export interface ActivityItem {
  id: string;
  type: "order" | "credit" | "registration";
  title: string;
  subtitle: string;
  amount?: number;
  amountLabel?: string;
  isNew?: boolean;
  /** When true, renders Approve / Reject buttons instead of amount */
  requiresAction?: boolean;
}
