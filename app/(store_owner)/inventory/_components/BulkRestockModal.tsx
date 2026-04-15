"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { InventoryItem, StoreOption } from "@/app/types/inventory";
import { cn } from "@/app/utils/cn";
import { SelectDropdown } from "@/app/components/ui/SelectDropdown";

interface RestockEntry {
  item: InventoryItem;
  quantity: number;
  newCost: string;
}

interface BulkRestockModalProps {
  open: boolean;
  allItems: InventoryItem[];
  onClose: () => void;
  onConfirm: (restocked: RestockEntry[]) => void;
  stores: StoreOption[];
  defaultStoreId?: string;
}

const inputClass =
  "w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";

function toSku(id: string) {
  return id.replace("inv-", "INV-").toUpperCase();
}

export function BulkRestockModal({
  open,
  allItems,
  onClose,
  onConfirm,
  stores,
  defaultStoreId,
}: BulkRestockModalProps) {
  const [search, setSearch] = useState("");
  const [restockList, setRestockList] = useState<RestockEntry[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(defaultStoreId ?? "all");

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const inList = new Set(restockList.map((r) => r.item.id));
    return allItems
      .filter(
        (item) =>
          !inList.has(item.id) &&
          (selectedStoreId === "all" || item.storeId === selectedStoreId) &&
          (item.name.toLowerCase().includes(q) ||
            toSku(item.id).toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [search, allItems, restockList, selectedStoreId]);

  function addItem(item: InventoryItem) {
    setRestockList((prev) => [...prev, { item, quantity: 1, newCost: "" }]);
    setSearch("");
    setShowDropdown(false);
  }

  function removeEntry(id: string) {
    setRestockList((prev) => prev.filter((r) => r.item.id !== id));
  }

  function updateEntry(
    id: string,
    field: "quantity" | "newCost",
    value: string
  ) {
    setRestockList((prev) =>
      prev.map((r) => {
        if (r.item.id !== id) return r;
        if (field === "quantity") {
          return { ...r, quantity: Math.max(1, Number(value) || 1) };
        }
        return { ...r, newCost: value };
      })
    );
  }

  const totalVolume = restockList.reduce((sum, r) => sum + r.quantity, 0);
  const storeOptions = [
    { value: "all", label: "All Stores" },
    ...stores.map((s) => ({ value: s.id, label: s.name })),
  ];

  function handleConfirm() {
    onConfirm(restockList);
    setRestockList([]);
    setSearch("");
    setSelectedStoreId(defaultStoreId ?? "all");
    onClose();
  }

  function handleClose() {
    setRestockList([]);
    setSearch("");
    setSelectedStoreId(defaultStoreId ?? "all");
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Bulk Restock Inventory"
    >
      <div
        className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-black text-foreground">
              Bulk Restock Inventory
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add items and update stock levels across your store.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Filter by Store
            </p>
            <SelectDropdown
              variant="field"
              triggerIcon="storefront"
              options={storeOptions}
              value={selectedStoreId}
              onChange={(v) => {
                setSelectedStoreId(v);
                setRestockList([]);
                setSearch("");
              }}
            />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Search Products
            </p>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-muted-foreground pointer-events-none"
                >
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Start typing product name or SKU…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                />

                {showDropdown && suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-2xl shadow-lg z-10 overflow-hidden">
                    {suggestions.map((item) => (
                      <li key={item.id}>
                        <button
                          onMouseDown={() => addItem(item)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                                unoptimized
                              />
                            ) : (
                              <span className="material-symbols-outlined text-muted-foreground text-sm">
                                inventory_2
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              SKU: {toSku(item.id)}
                            </p>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-primary/70 shrink-0">
                            Add
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() => suggestions[0] && addItem(suggestions[0])}
                disabled={suggestions.length === 0}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-black transition-all",
                  suggestions.length > 0
                    ? "border-primary/30 text-primary hover:bg-primary/5 active:scale-95"
                    : "border-border text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span className="hidden sm:inline">Add Item</span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Restock List{" "}
              {restockList.length > 0 && (
                <span className="text-foreground">({restockList.length} items)</span>
              )}
            </p>

            {restockList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-border text-center">
                <span className="material-symbols-outlined text-muted-foreground/30 text-5xl mb-3">
                  inventory
                </span>
                <p className="text-sm font-bold text-muted-foreground/60">
                  No items added yet
                </p>
                <p className="text-[11px] text-muted-foreground/40 mt-1">
                  Search above and add products to restock.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {restockList.map((entry) => (
                  <li
                    key={entry.item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                        {entry.item.imageUrl ? (
                          <Image
                            src={entry.item.imageUrl}
                            alt={entry.item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                            unoptimized
                          />
                        ) : (
                          <span className="material-symbols-outlined text-muted-foreground text-xl">
                            inventory_2
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground truncate leading-tight">
                          {entry.item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-widest">
                          SKU: {toSku(entry.item.id)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-end gap-2 sm:gap-3 shrink-0">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={entry.quantity}
                          onChange={(e) =>
                            updateEntry(entry.item.id, "quantity", e.target.value)
                          }
                          className={cn(inputClass, "w-24 text-center")}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-1">
                          New Cost (Opt)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={entry.newCost}
                          placeholder="—"
                          onChange={(e) =>
                            updateEntry(entry.item.id, "newCost", e.target.value)
                          }
                          className={cn(inputClass, "w-28 text-center")}
                        />
                      </div>
                      <button
                        onClick={() => removeEntry(entry.item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors mb-0.5"
                        aria-label={`Remove ${entry.item.name} from restock list`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="px-7 py-5 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Total Restock Volume
            </p>
            <p className="text-2xl font-black text-primary mt-0.5 leading-none">
              {totalVolume}{" "}
              <span className="text-base font-bold text-muted-foreground">
                Items
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-border text-sm font-black text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={restockList.length === 0}
              className={cn(
                "flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-black transition-all",
                restockList.length > 0
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Confirm Restock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
