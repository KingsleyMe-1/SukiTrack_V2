import {
  pgTable,
  text,
  integer,
  real,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

// ── stores ─────────────────────────────────────────────────────────────────
// Represents each physical / pop-up sari-sari store location.

export const stores = pgTable("stores", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  // References auth.users.id — scopes each store to its owner
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  /** "active" | "ongoing-maintenance" | "closed" */
  status: text("status").notNull().default("active"),
  icon: text("icon").notNull().default("storefront"),
  todaysSales: real("todays_sales").notNull().default(0),
  stockLevelPercent: integer("stock_level_percent").notNull().default(0),
  /** "optimal" | "low-stock" | "full" */
  stockLevelStatus: text("stock_level_status").notNull().default("optimal"),
  dailyTarget: real("daily_target"),
  manager: text("manager"),
  monthlyGrowthPercent: real("monthly_growth_percent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── store_credit_accounts ──────────────────────────────────────────────────
// Credit account avatars displayed on each store card.

export const storeCreditAccounts = pgTable("store_credit_accounts", {
  id: serial("id").primaryKey(),
  storeId: text("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  initials: text("initials").notNull(),
  colorClass: text("color_class").notNull(),
});

// ── inventory_items ────────────────────────────────────────────────────────
// Individual products tracked per store.

export const inventoryItems = pgTable("inventory_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text("store_id").references(() => stores.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  /** InventoryCategory union value */
  category: text("category").notNull(),
  /** "healthy" | "low-stock" | "out-of-stock" */
  status: text("status").notNull().default("healthy"),
  stockCount: integer("stock_count").notNull().default(0),
  cost: real("cost").notNull().default(0),
  price: real("price").notNull().default(0),
  lastRestock: text("last_restock").notNull(),
  lastUpdated: timestamp("last_updated"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── customers ──────────────────────────────────────────────────────────────
// Suki (regular customer) credit accounts.

export const customers = pgTable("customers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  // References auth.users.id — scopes each customer to their store owner
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  /** "high-risk" | "stable" | "due-soon" | "new" */
  creditStatus: text("credit_status").notNull().default("new"),
  creditBalance: real("credit_balance").notNull().default(0),
  lastPurchase: text("last_purchase").notNull(),
  avatarUrl: text("avatar_url"),
  initials: text("initials").notNull(),
  avatarColorClass: text("avatar_color_class").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── sold_items ─────────────────────────────────────────────────────────────
// Records every individual sale transaction.
// Item name & price are snapshotted so the record stays meaningful even if
// the inventory item is later edited or deleted.

export const soldItems = pgTable("sold_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  /** FK to the source inventory item (nullable — preserved if item is deleted) */
  inventoryItemId: text("inventory_item_id").references(
    () => inventoryItems.id,
    { onDelete: "set null" }
  ),
  storeId: text("store_id").references(() => stores.id, {
    onDelete: "set null",
  }),
  /** Scopes the record to its store owner */
  ownerId: text("owner_id").notNull(),
  /** Snapshot of item name at time of sale */
  itemName: text("item_name").notNull(),
  quantitySold: integer("quantity_sold").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
  totalAmount: real("total_amount").notNull(),
  /** "walking" | "vip" | "named" */
  customerType: text("customer_type").notNull().default("walking"),
  /** Free-text customer name (null for walking customers) */
  customerName: text("customer_name"),
  /** FK to customers table if a registered suki was selected */
  customerId: text("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
  soldAt: timestamp("sold_at").notNull().defaultNow(),
});
