"use client";

import { useState, useEffect } from "react";
import type { InventoryItem } from "@/app/types/inventory";
import { formatPHP } from "@/app/utils/format";
import { cn } from "@/app/utils/cn";

// Generate a short SKU-style string from the item id
function toSku(id: string): string {
  return id.replace(/-/g, "").slice(-6).toUpperCase();
}

export interface RecordSaleModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  /** Called after a successful sale; payload has the new stock count & status */
  onSaleRecorded: (
    itemId: string,
    newStockCount: number,
    newStatus: InventoryItem["status"]
  ) => void;
  onRecordSale: (payload: {
    inventoryItemId: string;
    storeId?: string;
    itemName: string;
    quantitySold: number;
    pricePerUnit: number;
    customerType: "walking" | "vip" | "named";
    customerName?: string;
  }) => Promise<{ newStockCount: number; newStatus: InventoryItem["status"] }>;
}

type CustomerType = "walking" | "vip" | "named";

export function RecordSaleModal({
  item,
  onClose,
  onSaleRecorded,
  onRecordSale,
}: RecordSaleModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [customerType, setCustomerType] = useState<CustomerType>("walking");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state whenever the item changes (new modal open)
  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setPrice(item.price);
    setCustomerType("walking");
    setCustomerName("");
    setError(null);
  }, [item]);

  // Lock body scroll while open
  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  if (!item) return null;

  const maxQty = item.stockCount;
  const totalAmount = quantity * price;
  const canSubmit = quantity >= 1 && price >= 0 && !loading;

  function increment() {
    setQuantity((q) => Math.min(q + 1, maxQty));
  }
  function decrement() {
    setQuantity((q) => Math.max(q - 1, 1));
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const result = await onRecordSale({
        inventoryItemId: item!.id,
        storeId: item!.storeId,
        itemName: item!.name,
        quantitySold: quantity,
        pricePerUnit: price,
        customerType,
        customerName:
          customerType === "named" && customerName.trim()
            ? customerName.trim()
            : undefined,
      });
      onSaleRecorded(item!.id, result.newStockCount, result.newStatus);
      onClose();
    } catch {
      setError("Failed to record sale. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isOutOfStock = item.status === "out-of-stock";
  const sku = `SKU: ${toSku(item.id)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Record Sale"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full sm:max-w-sm bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden",
          "transition-all"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-black text-foreground leading-none">
              Record Sale
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mt-1">
              Transaction Registry
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-6 pb-4">
          <div className="rounded-2xl bg-accent/40 dark:bg-accent/20 border border-border px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                  isOutOfStock
                    ? "bg-destructive/15 text-destructive"
                    : item.status === "low-stock"
                    ? "bg-warning/15 text-warning"
                    : "bg-primary/15 text-primary"
                )}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : item.status === "low-stock"
                  ? "Low Stock"
                  : "In Stock"}
              </span>
              <span className="text-[10px] text-muted-foreground font-bold">
                {sku}
              </span>
            </div>
            <p className="font-black text-sm text-foreground leading-snug">
              {item.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {item.stockCount} units available
            </p>
          </div>
        </div>

        <div className="px-6 pb-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Quantity Sold
            </p>
            <div className="flex items-center gap-0 rounded-xl border border-border overflow-hidden bg-background">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1}
                className={cn(
                  "w-10 h-10 flex items-center justify-center text-lg font-black transition-colors",
                  quantity <= 1
                    ? "text-muted-foreground/30 cursor-not-allowed"
                    : "text-foreground hover:bg-muted cursor-pointer"
                )}
                aria-label="Decrease quantity"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span className="flex-1 text-center font-black text-sm text-foreground select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= maxQty}
                className={cn(
                  "w-10 h-10 flex items-center justify-center text-lg font-black transition-colors",
                  quantity >= maxQty
                    ? "text-muted-foreground/30 cursor-not-allowed"
                    : "text-foreground hover:bg-muted cursor-pointer"
                )}
                aria-label="Increase quantity"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Price (PHP)
            </p>
            <div className="flex items-center gap-1.5 h-10 rounded-xl border border-border bg-background px-3 focus-within:ring-2 focus-within:ring-primary/40 transition-shadow">
              <span className="text-sm font-black text-muted-foreground">₱</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) =>
                  setPrice(Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="flex-1 w-0 bg-transparent text-sm font-black text-foreground focus:outline-none min-w-0"
                aria-label="Price per unit"
              />
            </div>
          </div>
        </div>

        {totalAmount > 0 && (
          <div className="px-6 pb-3">
            <div className="flex items-center justify-between rounded-xl bg-primary/8 dark:bg-primary/12 px-4 py-2.5">
              <span className="text-xs font-bold text-muted-foreground">Total Amount</span>
              <span className="text-sm font-black text-primary">
                {formatPHP(totalAmount)}
              </span>
            </div>
          </div>
        )}

        <div className="px-6 pb-4">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Customer Selection
          </p>

          <div className="flex items-center gap-2 h-10 rounded-xl border border-border bg-background px-3 mb-2.5 focus-within:ring-2 focus-within:ring-primary/40 transition-shadow">
            <span className="material-symbols-outlined text-[18px] text-muted-foreground shrink-0">
              person_search
            </span>
            <input
              type="text"
              placeholder="Search or add new customer…"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (e.target.value.trim()) setCustomerType("named");
                else setCustomerType("walking");
              }}
              className="flex-1 bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {customerName && (
              <button
                type="button"
                onClick={() => { setCustomerName(""); setCustomerType("walking"); }}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Clear customer name"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setCustomerType("walking"); setCustomerName(""); }}
              className={cn(
                "py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border cursor-pointer",
                customerType === "walking"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:bg-muted"
              )}
            >
              Walk-in
            </button>
            <button
              type="button"
              onClick={() => { setCustomerType("vip"); setCustomerName(""); }}
              className={cn(
                "py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border cursor-pointer",
                customerType === "vip"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/25"
                  : "bg-transparent text-muted-foreground border-border hover:bg-muted"
              )}
            >
              VIP Member
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-3 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-2.5">
            <span className="material-symbols-outlined text-destructive text-[16px] shrink-0">
              error
            </span>
            <p className="text-xs font-bold text-destructive">{error}</p>
          </div>
        )}

        <div className="px-6 pb-6 space-y-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isOutOfStock}
            className={cn(
              "w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
              canSubmit && !isOutOfStock
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                : "bg-primary/30 text-primary-foreground/50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                Recording…
              </span>
            ) : (
              "Record Sale"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-xs font-black text-muted-foreground uppercase tracking-widest py-1 hover:text-foreground transition-colors cursor-pointer"
          >
            Return to Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
