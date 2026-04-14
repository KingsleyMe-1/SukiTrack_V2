import type { Metadata } from "next";
import Header from "./_components/Header";
import { InventoryCatalog } from "./_components/InventoryCatalog";
import type { InventoryItem, InventoryCategory } from "@/app/types/inventory";
import { Footer } from "@/app/components/landing/Footer";

export const metadata: Metadata = {
  title: "Inventory Control | SukiTrack",
  description: "Real-time stock monitoring and logistics for your store.",
};


const CATEGORIES: InventoryCategory[] = [
  "Grains & Rice",
  "Canned Goods",
  "Beverages",
  "Cooking Essentials",
  "Baking & Spices",
  "Quick Meals",
  "Household",
];

const mockItems: InventoryItem[] = [
  {
    id: "inv-001",
    name: "Jasmine Rice 5kg",
    category: "Grains & Rice",
    status: "low-stock",
    stockCount: 12,
    cost: 420,
    price: 515,
    lastRestock: "2023-10-12",
  },
  {
    id: "inv-002",
    name: "Evaporated Milk 370ml",
    category: "Beverages",
    status: "healthy",
    stockCount: 144,
    cost: 28.5,
    price: 35,
    lastRestock: "2023-10-28",
  },
  {
    id: "inv-003",
    name: "Vegetable Oil 1L",
    category: "Cooking Essentials",
    status: "out-of-stock",
    stockCount: 0,
    cost: 85,
    price: 110,
    lastRestock: "2023-09-30",
  },
  {
    id: "inv-004",
    name: "Brown Sugar 1kg",
    category: "Baking & Spices",
    status: "healthy",
    stockCount: 85,
    cost: 52,
    price: 68,
    lastRestock: "2023-11-05",
  },
  {
    id: "inv-005",
    name: "Cooking Oil 1L",
    category: "Cooking Essentials",
    status: "low-stock",
    stockCount: 8,
    cost: 92,
    price: 115,
    lastRestock: "2023-11-10",
  },
  {
    id: "inv-006",
    name: "Canned Corned Beef",
    category: "Canned Goods",
    status: "healthy",
    stockCount: 210,
    cost: 45,
    price: 58,
    lastRestock: "2023-11-02",
  },
  {
    id: "inv-007",
    name: "Instant Noodles (Pack of 6)",
    category: "Quick Meals",
    status: "healthy",
    stockCount: 350,
    cost: 65,
    price: 82,
    lastRestock: "2023-11-08",
  },
  {
    id: "inv-008",
    name: "Laundry Detergent 500g",
    category: "Household",
    status: "healthy",
    stockCount: 48,
    cost: 185,
    price: 220,
    lastRestock: "2023-10-25",
  },
  {
    id: "inv-009",
    name: "Canned Sardines 155g",
    category: "Canned Goods",
    status: "healthy",
    stockCount: 320,
    cost: 22,
    price: 30,
    lastRestock: "2023-11-01",
  },
  {
    id: "inv-010",
    name: "Soy Sauce 385ml",
    category: "Cooking Essentials",
    status: "low-stock",
    stockCount: 6,
    cost: 30,
    price: 42,
    lastRestock: "2023-10-18",
  },
  {
    id: "inv-011",
    name: "Coffee 3-in-1 (25 Sachets)",
    category: "Beverages",
    status: "healthy",
    stockCount: 95,
    cost: 125,
    price: 160,
    lastRestock: "2023-11-07",
  },
  {
    id: "inv-012",
    name: "Vinegar 1L",
    category: "Cooking Essentials",
    status: "out-of-stock",
    stockCount: 0,
    cost: 28,
    price: 38,
    lastRestock: "2023-09-22",
  },
];


export default function InventoryPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 md:px-10 py-6 space-y-6">
        <Header />
        <InventoryCatalog items={mockItems} categories={CATEGORIES} />
      </div>
    </div>
  );
}
