import type { Metadata } from "next";
import { createClient } from "@/app/utils/supabase/server";
import { getInventoryItems } from "@/app/data/supabase/inventory";
import { getStores } from "@/app/data/supabase/stores";
import { CATEGORIES } from "@/app/data/mock/inventory";
import { InventoryCatalog } from "./_components/InventoryCatalog";

export const metadata: Metadata = {
  title: "Inventory Control | SukiTrack",
  description: "Real-time stock monitoring and logistics for your store.",
};

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ownerId = user!.id;

  const [items, ownedStores] = await Promise.all([
    getInventoryItems(ownerId),
    getStores(ownerId),
  ]);

  const storeOptions = ownedStores.map((s) => ({
    id: s.id,
    name: s.name,
    status: s.status,
  }));

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 md:px-10 py-6 space-y-6">
        <InventoryCatalog items={items} categories={CATEGORIES} stores={storeOptions} />
      </div>
    </div>
  );
}
