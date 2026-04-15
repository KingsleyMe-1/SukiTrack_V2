import type { Metadata } from "next";
import { StoreCatalog } from "./_components/StoreCatalog";
import { mockStores } from "@/app/data/stores";

export const metadata: Metadata = {
  title: "Managed Stores | SukiTrack",
  description: "Oversee and manage all your store locations from one place.",
};

export default function StoresPage() {
  return <StoreCatalog initialStores={mockStores} />;
}
