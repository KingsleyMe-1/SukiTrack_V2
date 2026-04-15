import { eq, and } from "drizzle-orm";
// 'and' is used in getStoreById ownership check
import { db } from "@/app/db";
import { stores, storeCreditAccounts } from "@/app/db/schema";
import type { ManagedStore, StoreStatus } from "@/app/types/stores";

// ── Types ──────────────────────────────────────────────────────────────────

type NewStore = Omit<ManagedStore, "id" | "creditAccounts" | "extraCreditCount"> & { ownerId: string };
type StoreUpdate = Partial<Omit<ManagedStore, "id" | "creditAccounts" | "ownerId">>;

function mapStore(
  store: typeof stores.$inferSelect,
  creditAccounts: { initials: string; colorClass: string }[],
  extraCreditCount: number
): ManagedStore {
  return {
    id: store.id,
    name: store.name,
    location: store.location,
    status: store.status as ManagedStore["status"],
    icon: store.icon,
    todaysSales: store.todaysSales,
    stockLevelPercent: store.stockLevelPercent,
    stockLevelStatus: store.stockLevelStatus as ManagedStore["stockLevelStatus"],
    dailyTarget: store.dailyTarget ?? undefined,
    manager: store.manager ?? undefined,
    monthlyGrowthPercent: store.monthlyGrowthPercent ?? undefined,
    creditAccounts,
    extraCreditCount,
  };
}

// ── Queries ────────────────────────────────────────────────────────────────

/** Fetch all stores owned by the given user, with their credit account avatars. */
export async function getStores(ownerId: string): Promise<ManagedStore[]> {
  const storeRows = await db.select().from(stores).where(eq(stores.ownerId, ownerId));
  const creditRows = await db.select().from(storeCreditAccounts);

  return storeRows.map((store) => {
    const accounts = creditRows.filter((c) => c.storeId === store.id);
    const MAX_VISIBLE = 3;
    return mapStore(
      store,
      accounts.slice(0, MAX_VISIBLE).map((a) => ({ initials: a.initials, colorClass: a.colorClass })),
      Math.max(0, accounts.length - MAX_VISIBLE)
    );
  });
}

/** Fetch a single store by its ID, verifying ownership. */
export async function getStoreById(id: string, ownerId: string): Promise<ManagedStore | null> {
  const [store] = await db.select().from(stores).where(and(eq(stores.id, id), eq(stores.ownerId, ownerId)));
  if (!store) return null;

  const accounts = await db
    .select()
    .from(storeCreditAccounts)
    .where(eq(storeCreditAccounts.storeId, id));

  const MAX_VISIBLE = 3;
  return mapStore(
    store,
    accounts.slice(0, MAX_VISIBLE).map((a) => ({ initials: a.initials, colorClass: a.colorClass })),
    Math.max(0, accounts.length - MAX_VISIBLE)
  );
}

// ── Mutations ──────────────────────────────────────────────────────────────

/** Register a new store location. */
export async function createStore(data: NewStore): Promise<ManagedStore> {
  const [created] = await db.insert(stores).values(data).returning();
  return mapStore(created, [], 0);
}

/** Update a store's details (e.g. sales figures, manager name). */
export async function updateStore(
  id: string,
  data: StoreUpdate
): Promise<ManagedStore> {
  const [updated] = await db
    .update(stores)
    .set(data)
    .where(eq(stores.id, id))
    .returning();
  return mapStore(updated, [], 0);
}

/** Change a store's operational status (e.g. put it into maintenance). */
export async function updateStoreStatus(
  id: string,
  status: StoreStatus
): Promise<void> {
  await db.update(stores).set({ status }).where(eq(stores.id, id));
}

/** Remove a store and its credit accounts (cascade). */
export async function deleteStore(id: string): Promise<void> {
  await db.delete(stores).where(eq(stores.id, id));
}
