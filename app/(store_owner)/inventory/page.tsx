import type { Metadata } from "next";
import { InventoryCatalog } from "./_components/InventoryCatalog";
import { mockInventoryItems, CATEGORIES, STORES } from "@/app/data/inventory";

export const metadata: Metadata = {
  title: "Inventory Control | SukiTrack",
  description: "Real-time stock monitoring and logistics for your store.",
};

export default function InventoryPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 md:px-10 py-6 space-y-6">
        <InventoryCatalog items={mockInventoryItems} categories={CATEGORIES} stores={STORES} />
      </div>
    </div>
  );
}
