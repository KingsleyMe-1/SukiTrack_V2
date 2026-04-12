import type { Metadata } from "next";
import { CustomerCatalog } from "./_components/CustomerCatalog";
import { Footer } from "@/app/components/landing/Footer";
import type { Customer } from "@/app/types/customers";

export const metadata: Metadata = {
  title: "Customers | SukiTrack",
  description: "Manage your suki accounts, credit balances, and repayment tracking.",
};

const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Maria Alcasid",
    phone: "+63 917 123 4567",
    creditStatus: "high-risk",
    creditBalance: 12450,
    lastPurchase: "Oct 12, 2023",
    initials: "MA",
    avatarColorClass: "bg-warning",
  },
  {
    id: "cust-002",
    name: "Ricardo Cruz",
    phone: "+63 920 987 6543",
    creditStatus: "stable",
    creditBalance: 2100,
    lastPurchase: "Today, 9:15 AM",
    initials: "RC",
    avatarColorClass: "bg-warning",
  },
  {
    id: "cust-003",
    name: "Elena Santos",
    phone: "+63 915 555 0199",
    creditStatus: "due-soon",
    creditBalance: 8720,
    lastPurchase: "Oct 24, 2023",
    initials: "ES",
    avatarColorClass: "bg-warning",
  },
  {
    id: "cust-004",
    name: "Juan Tan",
    phone: "+63 928 333 4444",
    creditStatus: "stable",
    creditBalance: 450,
    lastPurchase: "Yesterday",
    initials: "JT",
    avatarColorClass: "bg-warning",
  },
  {
    id: "cust-005",
    name: "Sarah Mercado",
    phone: "+63 944 888 7766",
    creditStatus: "new",
    creditBalance: 0,
    lastPurchase: "First Time",
    initials: "SM",
    avatarColorClass: "bg-warning",
  },
  {
    id: "cust-006",
    name: "Paul Ramos",
    phone: "+63 918 000 1122",
    creditStatus: "stable",
    creditBalance: 1280,
    lastPurchase: "Oct 26, 2023",
    initials: "PR",
    avatarColorClass: "bg-warning",
  },
];

const COLLECTION_RATE = 92;


export default function CustomersPage() {
  const activeCount = mockCustomers.length;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 md:px-10 py-6 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Customers
            </h2>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                {activeCount} Active Sukis
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                Updated 5 minutes ago
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all cursor-pointer whitespace-nowrap self-start">
            <span className="material-symbols-outlined text-sm">person_add</span>
            New Customer
          </button>
        </div>

        <CustomerCatalog
          customers={mockCustomers}
          collectionRate={COLLECTION_RATE}
        />

      </div>
      <Footer />
    </div>
  );
}
