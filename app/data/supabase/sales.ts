import { eq, sql } from "drizzle-orm";
import { db } from "@/app/db";
import { soldItems, inventoryItems, stores } from "@/app/db/schema";


export interface RecordSaleInput {
  inventoryItemId: string;
  storeId?: string;
  ownerId: string;
  itemName: string;
  quantitySold: number;
  pricePerUnit: number;
  customerType: "walking" | "vip" | "named";
  customerName?: string;
  customerId?: string;
}

export interface SaleResult {
  saleId: string;
  newStockCount: number;
  newStatus: "healthy" | "low-stock" | "out-of-stock";
  totalAmount: number;
}

const LOW_STOCK_THRESHOLD = 20;

function deriveStatus(count: number): "healthy" | "low-stock" | "out-of-stock" {
  if (count === 0) return "out-of-stock";
  if (count < LOW_STOCK_THRESHOLD) return "low-stock";
  return "healthy";
}

// ── Mutations ──────────────────────────────────────────────────────────────

/**
 * Record a sale transaction.
 * - Inserts a sold_items row.
 * - Decrements inventory_items.stock_count and updates status.
 * - Increments stores.todays_sales by the total amount.
 *
 * All done in a single Drizzle transaction to keep data consistent.
 */
export async function recordSale(input: RecordSaleInput): Promise<SaleResult> {
  const totalAmount = input.pricePerUnit * input.quantitySold;

  return db.transaction(async (tx) => {
    // 1. Lock and read current stock
    const [item] = await tx
      .select({ stockCount: inventoryItems.stockCount })
      .from(inventoryItems)
      .where(eq(inventoryItems.id, input.inventoryItemId));

    if (!item) throw new Error("Inventory item not found");

    const newStockCount = Math.max(0, item.stockCount - input.quantitySold);
    const newStatus = deriveStatus(newStockCount);

    // 2. Update inventory item
    await tx
      .update(inventoryItems)
      .set({
        stockCount: newStockCount,
        status: newStatus,
        lastUpdated: new Date(),
      })
      .where(eq(inventoryItems.id, input.inventoryItemId));

    // 3. Increment store's today's sales
    if (input.storeId) {
      await tx
        .update(stores)
        .set({
          todaysSales: sql`${stores.todaysSales} + ${totalAmount}`,
        })
        .where(eq(stores.id, input.storeId));
    }

    // 4. Insert sale record
    const [sale] = await tx
      .insert(soldItems)
      .values({
        inventoryItemId: input.inventoryItemId,
        storeId: input.storeId ?? null,
        ownerId: input.ownerId,
        itemName: input.itemName,
        quantitySold: input.quantitySold,
        pricePerUnit: input.pricePerUnit,
        totalAmount,
        customerType: input.customerType,
        customerName: input.customerName ?? null,
        customerId: input.customerId ?? null,
      })
      .returning({ id: soldItems.id });

    return { saleId: sale.id, newStockCount, newStatus, totalAmount };
  });
}
