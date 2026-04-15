"use server";

import { createClient } from "@/app/utils/supabase/server";
import {
  createStore,
  updateStore,
  deleteStore,
} from "@/app/data/supabase/stores";
import type { ManagedStore } from "@/app/types/stores";

type CreateStoreInput = Pick<ManagedStore, "name" | "location" | "dailyTarget" | "manager">;

export async function createStoreAction(input: CreateStoreInput): Promise<ManagedStore> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  return createStore({
    name: input.name,
    location: input.location,
    status: "active",
    icon: "storefront",
    todaysSales: 0,
    stockLevelPercent: 0,
    stockLevelStatus: "optimal",
    dailyTarget: input.dailyTarget,
    manager: input.manager,
    monthlyGrowthPercent: 0,
    ownerId: user.id,
  });
}

export async function updateStoreAction(
  id: string,
  data: Partial<Pick<ManagedStore, "name" | "location" | "dailyTarget" | "manager">>
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await updateStore(id, data);
}

export async function deleteStoreAction(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await deleteStore(id);
}
