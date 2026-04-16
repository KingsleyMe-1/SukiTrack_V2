"use server";

import { createClient } from "@/app/utils/supabase/server";
import { createInventoryItem } from "@/app/data/supabase/inventory";
import { recordSale } from "@/app/data/supabase/sales";
import type { InventoryItem } from "@/app/types/inventory";
import type { SaleResult } from "@/app/data/supabase/sales";

type AddItemInput = Omit<InventoryItem, "id" | "lastUpdated">;

export async function addInventoryItemAction(
  input: AddItemInput
): Promise<InventoryItem> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const today = new Date().toISOString().split("T")[0];

  return createInventoryItem({
    id: crypto.randomUUID(),
    name: input.name,
    category: input.category,
    status: input.status,
    stockCount: input.stockCount,
    cost: input.cost,
    price: input.price,
    lastRestock: input.lastRestock ?? today,
    storeId: input.storeId,
    imageUrl: input.imageUrl,
  });
}

export interface RecordSalePayload {
  inventoryItemId: string;
  storeId?: string;
  itemName: string;
  quantitySold: number;
  pricePerUnit: number;
  customerType: "walking" | "vip" | "named";
  customerName?: string;
}

export async function recordSaleAction(
  payload: RecordSalePayload
): Promise<SaleResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  return recordSale({
    ...payload,
    ownerId: user.id,
  });
}
