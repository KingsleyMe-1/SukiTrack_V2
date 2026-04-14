import { useState, useEffect } from "react";
import Image from "next/image";
import type { InventoryItem, InventoryCategory, StockStatus } from "@/app/types/inventory";
import { cn } from "@/app/utils/cn";

const EDITABLE_CATEGORIES: Exclude<InventoryCategory, "All Categories">[] = [
  "Grains & Rice",
  "Canned Goods",
  "Beverages",
  "Cooking Essentials",
  "Baking & Spices",
  "Quick Meals",
  "Household",
];

const LOW_STOCK_THRESHOLD = 20;

interface FormState {
  name: string;
  category: Exclude<InventoryCategory, "All Categories">;
  stockCount: number;
  cost: number;
  price: number;
}

interface ProductDetailsModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onUpdate?: (updated: InventoryItem) => void;
  onDelete?: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Grains & Rice": "grocery",
  "Canned Goods": "inventory_2",
  "Beverages": "local_cafe",
  "Cooking Essentials": "restaurant",
  "Baking & Spices": "bakery_dining",
  "Quick Meals": "fastfood",
  "Household": "cleaning_services",
};

function deriveStatus(stockCount: number): StockStatus {
  if (stockCount === 0) return "out-of-stock";
  if (stockCount < LOW_STOCK_THRESHOLD) return "low-stock";
  return "healthy";
}

function ProductPlaceholder({ item }: { item: InventoryItem }) {
  const icon = CATEGORY_ICONS[item.category] ?? "inventory_2";

  if (item.imageUrl) {
    return (
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={160}
        height={160}
        className="w-40 h-40 object-contain drop-shadow-2xl rounded-2xl"
      />
    );
  }

  return (
    <div className="relative w-44 h-44 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.10] via-white/[0.04] to-transparent" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-white/50 text-[64px] leading-none">
          {icon}
        </span>
        <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/25 px-3 py-1 rounded-full border border-white/10 bg-white/5">
          {item.category}
        </span>
      </div>
    </div>
  );
}

function InputField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-border bg-accent/30 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";

export function ProductDetailsModal({
  item,
  onClose,
  onUpdate,
  onDelete,
}: ProductDetailsModalProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    category: "Grains & Rice",
    stockCount: 0,
    cost: 0,
    price: 0,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [syncedItemId, setSyncedItemId] = useState<string | null>(null);

  // Adjusting state based on props — avoids useEffect-driven setState
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (item && item.id !== syncedItemId) {
    setSyncedItemId(item.id);
    setForm({
      name: item.name,
      category: item.category as Exclude<InventoryCategory, "All Categories">,
      stockCount: item.stockCount,
      cost: item.cost,
      price: item.price,
    });
    setConfirmDelete(false);
  }

  // Escape key to close
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [item, onClose]);

  if (!item) return null;

  const isOutOfStock = form.stockCount === 0;
  const isCriticalLow =
    form.stockCount > 0 && form.stockCount < LOW_STOCK_THRESHOLD;
  const showWarning = isOutOfStock || isCriticalLow;


  function handleUpdate() {
    if (!item) return;
    onUpdate?.({
      ...item,
      ...form,
      status: deriveStatus(form.stockCount),
      lastUpdated: new Date().toISOString(),
    });
    onClose();
  }

  function handleDelete() {
    if (!item) return;
    onDelete?.(item.id);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Edit Product Details"
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="hidden sm:flex sm:w-2/5 flex-col p-8 relative overflow-hidden"
          style={{ backgroundColor: "var(--foreground)" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <span className="text-[6rem] font-black italic text-white/[0.04] whitespace-nowrap -rotate-12 tracking-tight leading-none">
              {item.name}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center z-10 py-4">
            <ProductPlaceholder item={item} />
          </div>

          <div className="z-10">
            <p className="text-xl font-black text-white leading-snug">
              {item.name}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-card min-w-0">
          <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-border">
            <div>
              <h2 className="text-base font-black text-foreground">
                Edit Product Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update stock levels, pricing, or category.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          </div>

          <div className="px-7 py-6 space-y-4 overflow-y-auto flex-1">
            <InputField label="Product Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
              />
            </InputField>

            <div className="grid grid-cols-2 gap-3">
              <InputField label="Category">
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        category: e.target.value as Exclude<
                          InventoryCategory,
                          "All Categories"
                        >,
                      }))
                    }
                    className={cn(inputClass, "pr-8 appearance-none cursor-pointer")}
                  >
                    {EDITABLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[14px] text-muted-foreground"
                  >
                    expand_more
                  </span>
                </div>
              </InputField>

              <InputField label="Stock Level">
                <input
                  type="number"
                  min={0}
                  value={form.stockCount}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      stockCount: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className={inputClass}
                />
              </InputField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField label="Unit Cost (₱)">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.cost}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      cost: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className={inputClass}
                />
              </InputField>

              <InputField label="Selling Price (₱)">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      price: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className={inputClass}
                />
              </InputField>
            </div>

            {showWarning && (
              <div
                className={cn(
                  "flex items-start gap-3 rounded-xl px-4 py-3 border",
                  isOutOfStock
                    ? "bg-destructive/10 border-destructive/20"
                    : "bg-warning/10 border-warning/20"
                )}
                role="alert"
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-base mt-0.5 shrink-0",
                    isOutOfStock ? "text-destructive" : "text-warning"
                  )}
                >
                  warning
                </span>
                <div>
                  <p
                    className={cn(
                      "text-xs font-black",
                      isOutOfStock ? "text-destructive" : "text-warning"
                    )}
                  >
                    {isOutOfStock ? "Out of Stock" : "Critical Low Stock"}
                  </p>
                  <p
                    className={cn(
                      "text-[11px] font-medium mt-0.5",
                      isOutOfStock
                        ? "text-destructive/80"
                        : "text-warning/80"
                    )}
                  >
                    {isOutOfStock
                      ? "This item has no remaining units."
                      : "This item is below the safety stock threshold."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="px-7 py-5 border-t border-border">
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-foreground">Remove this product?</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-black text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-black hover:scale-[1.02] active:scale-95 transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  Yes, Delete
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-primary text-primary-foreground text-sm font-black py-3 rounded-xl shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  Update Product
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-sm font-black text-muted-foreground hover:text-destructive transition-colors px-4 py-3 cursor-pointer rounded-xl bg-destructive/20 hover:bg-destructive/40 active:bg-destructive/30 transition-colors"
                  aria-label="Delete product"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
