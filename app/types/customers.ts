export type CustomerCreditStatus = "high-risk" | "stable" | "due-soon" | "new";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  creditStatus: CustomerCreditStatus;
  creditBalance: number;
  lastPurchase: string;
  avatarUrl?: string;
  initials: string;
  avatarColorClass: string;
}
