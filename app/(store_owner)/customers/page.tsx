import type { Metadata } from "next";
import { CustomerCatalog } from "./_components/CustomerCatalog";
import { mockCustomers, COLLECTION_RATE } from "@/app/data/customers";

export const metadata: Metadata = {
  title: "Customers | SukiTrack",
  description: "Manage your suki accounts, credit balances, and repayment tracking.",
};

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
    </div>
  );
}
