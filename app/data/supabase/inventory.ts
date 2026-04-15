import { eq, and } from "drizzle-orm";
import { db } from "@/app/db";
import { inventoryItems, stores } from "@/app/db/schema";
import type { InventoryItem } from "@/app/types/inventory";

// ── Types ──────────────────────────────────────────────────────────────────

type NewInventoryItem = Omit<InventoryItem, "lastUpdated">;
type InventoryItemUpdate = Partial<Omit<InventoryItem, "id">>;

// Drizzle returns lastUpdated as Date | null; the app type expects string | undefined.
type DbRow = {
  id: string;
  storeId: string | null;
  name: string;
  category: string;
  status: string;
  stockCount: number;
  cost: number;
  price: number;
  lastRestock: string;
  lastUpdated: Date | null;
  imageUrl: string | null;
  createdAt: Date;
};

function mapRow(row: DbRow): InventoryItem {
  return {
    id: row.id,
    storeId: row.storeId ?? undefined,
    name: row.name,
    category: row.category as InventoryItem["category"],
    status: row.status as InventoryItem["status"],
    stockCount: row.stockCount,
    cost: row.cost,
    price: row.price,
    lastRestock: row.lastRestock,
    lastUpdated: row.lastUpdated?.toISOString(),
    imageUrl: row.imageUrl ?? undefined,
  };
}

const ITEM_FIELDS = {
  id: inventoryItems.id,
  storeId: inventoryItems.storeId,
  name: inventoryItems.name,
  category: inventoryItems.category,
  status: inventoryItems.status,
  stockCount: inventoryItems.stockCount,
  cost: inventoryItems.cost,
  price: inventoryItems.price,
  lastRestock: inventoryItems.lastRestock,
  lastUpdated: inventoryItems.lastUpdated,
  imageUrl: inventoryItems.imageUrl,
  createdAt: inventoryItems.createdAt,
} as const;

// ── Queries ────────────────────────────────────────────────────────────────

/**
 * Fetch all inventory items belonging to the owner's stores.
 * Optionally narrow to a specific store.
 */
export async function getInventoryItems(ownerId: string, storeId?: string): Promise<InventoryItem[]> {
  const baseQuery = db
    .select(ITEM_FIELDS)
    .from(inventoryItems)
    .innerJoin(stores, and(eq(stores.id, inventoryItems.storeId!), eq(stores.ownerId, ownerId)));

  const rows = storeId
    ? await baseQuery.where(eq(inventoryItems.storeId, storeId))
    : await baseQuery;

  return rows.map(mapRow);
}

/** Fetch a single inventory item by its ID, verifying it belongs to the owner. */
export async function getInventoryItemById(id: string, ownerId: string): Promise<InventoryItem | null> {
  const [row] = await db
    .select(ITEM_FIELDS)
    .from(inventoryItems)
    .innerJoin(stores, and(eq(stores.id, inventoryItems.storeId!), eq(stores.ownerId, ownerId)))
    .where(eq(inventoryItems.id, id));
  return row ? mapRow(row) : null;
}

// ── Mutations ──────────────────────────────────────────────────────────────

/** Add a new product to inventory. */
export async function createInventoryItem(data: NewInventoryItem): Promise<InventoryItem> {
  const [created] = await db.insert(inventoryItems).values(data).returning();
  return mapRow(created as unknown as DbRow);
}

/** Update an existing inventory item's fields. */
export async function updateInventoryItem(
  id: string,
  data: InventoryItemUpdate
): Promise<InventoryItem> {
  const [updated] = await db
    .update(inventoryItems)
    .set({ ...data, lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : undefined })
    .where(eq(inventoryItems.id, id))
    .returning();
  return mapRow(updated as unknown as DbRow);
}

/** Remove an inventory item permanently. */
export async function deleteInventoryItem(id: string): Promise<void> {
  await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
}
