import type { Metadata } from "next";
import { createClient } from "@/app/utils/supabase/server";
import { getStores } from "@/app/data/supabase/stores";
import { StoreCatalog } from "./_components/StoreCatalog";

export const metadata: Metadata = {
  title: "Managed Stores | SukiTrack",
  description: "Oversee and manage all your store locations from one place.",
};

export default async function StoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const stores = await getStores(user!.id);

  return <StoreCatalog initialStores={stores} />;
}
