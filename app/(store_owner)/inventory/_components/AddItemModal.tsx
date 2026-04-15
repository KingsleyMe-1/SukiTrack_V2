"use client";

import { useState, useEffect } from "react";
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

const CATEGORY_ICONS: Record<string, string> = {
  "Grains & Rice": "grocery",
  "Canned Goods": "inventory_2",
  "Beverages": "local_cafe",
  "Cooking Essentials": "restaurant",
  "Baking & Spices": "bakery_dining",
  "Quick Meals": "fastfood",
  "Household": "cleaning_services",
};

const LOW_STOCK_THRESHOLD = 20;

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-border bg-accent/30 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";

function deriveStatus(count: number): StockStatus {
  if (count === 0) return "out-of-stock";
  if (count < LOW_STOCK_THRESHOLD) return "low-stock";
  return "healthy";
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

interface FormState {
  name: string;
  category: Exclude<InventoryCategory, "All Categories">;
  stockCount: number;
  cost: number;
  price: number;
}

const DEFAULT_FORM: FormState = {
  name: "",
  category: "Grains & Rice",
  stockCount: 0,
  cost: 0,
  price: 0,
};

export interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
}

export function AddItemModal({ open, onClose, onAdd }: AddItemModalProps) {
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM });
  function handleClose() {
    setForm({ ...DEFAULT_FORM });
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  const icon = CATEGORY_ICONS[form.category] ?? "inventory_2";
  const isOutOfStock = form.stockCount === 0;
  const isCriticalLow = form.stockCount > 0 && form.stockCount < LOW_STOCK_THRESHOLD;
  const showWarning = isOutOfStock || isCriticalLow;
  const canSubmit = form.name.trim() !== "";

  

  function handleAdd() {
    if (!canSubmit) return;
    const today = new Date().toISOString().split("T")[0];
    onAdd({
      id: `inv-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      status: deriveStatus(form.stockCount),
      stockCount: form.stockCount,
      cost: form.cost,
      price: form.price,
      lastRestock: today,
    });
    setForm({ ...DEFAULT_FORM });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/60 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add New Item"
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="hidden sm:flex sm:w-2/5 flex-col p-8 relative overflow-hidden"
          style={{ backgroundColor: "var(--foreground)" }}
        >
          <div className="flex-1 flex items-center justify-center z-10 py-4">
            <div className="relative w-44 h-44 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.10] via-white/[0.04] to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-white/50 text-[64px] leading-none">
                  {icon}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/25 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                  {form.category}
                </span>
              </div>
            </div>
          </div>

          <div className="z-10">
            <p className="text-xl font-black text-white leading-snug line-clamp-2">
              {form.name || "New Product"}
            </p>
            <p className="text-xs text-white/40 mt-0.5 font-medium">
              Adding to inventory
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-card min-w-0">
          <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-border">
            <div>
              <h2 className="text-base font-black text-foreground">
                Add New Item
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fill in the details to add a product to inventory.
              </p>
            </div>
            <button
              onClick={handleClose}
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
                placeholder="e.g. Jasmine Rice 5kg"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className={inputClass}
                autoFocus
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
                    {isOutOfStock ? "No Stock Set" : "Low Stock Warning"}
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
                      ? "This product will be listed as out of stock."
                      : "Stock is below the safety threshold."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="px-7 py-5 border-t border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-black text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!canSubmit}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 text-sm font-black py-3 rounded-xl transition-all",
                  canSubmit
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                    : "bg-primary/30 text-primary-foreground/50 cursor-not-allowed"
                )}
              >
                <span className="material-symbols-outlined text-[18px]">
                  add_circle
                </span>
                Add to Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
