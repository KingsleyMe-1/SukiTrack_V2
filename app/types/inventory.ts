export type StockStatus = "healthy" | "low-stock" | "out-of-stock";

export type InventoryCategory =
  | "All Categories"
  | "Grains & Rice"
  | "Canned Goods"
  | "Beverages"
  | "Cooking Essentials"
  | "Baking & Spices"
  | "Quick Meals"
  | "Household";

export interface StoreOption {
  id: string;
  name: string;
  status: "active" | "ongoing-maintenance" | "closed";
}

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  status: StockStatus;
  stockCount: number;
  cost: number;
  price: number;
  lastRestock: string;
  lastUpdated?: string;
  imageUrl?: string;
  storeId?: string;
}
