// ── TypeScript interfaces for the Managed Stores page ────────────────────────
// Shaped to match future Supabase query return types.
// Replace mock data with async server fetches when the data layer is ready.

export type StoreStatus = "active" | "ongoing-maintenance" | "closed";

export type StockLevelStatus = "optimal" | "low-stock" | "full";

export interface CreditAccount {
  initials: string;
  colorClass: string;
}

export interface ManagedStore {
  id: string;
  name: string;
  location: string;
  status: StoreStatus;
  icon: string;
  todaysSales: number;
  creditAccounts: CreditAccount[];
  extraCreditCount: number;
  stockLevelPercent: number;
  stockLevelStatus: StockLevelStatus;
}
