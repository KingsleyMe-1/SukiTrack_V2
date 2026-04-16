import type { InventoryItem } from "@/app/types/inventory";
import { formatPHP } from "@/app/utils/format";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/app/utils/cn";
import Image from "next/image";
import { useState } from "react";
import { ProductDetailsModal } from "./ProductDetailsModal";

const HEADERS = [
  { label: "Product Name", className: "text-left" },
  { label: "Status", className: "text-center" },
  { label: "Stock Level", className: "text-center" },
  { label: "Cost", className: "text-center" },
  { label: "Price", className: "text-center" },
  { label: "Last Restock", className: "text-center" },
  { label: "Last Updated", className: "text-center" },
  { label: "Action", className: "text-center" },
] as const;

type ModalType = InventoryItem | null;

function formatRestockDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLastUpdated(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (isToday) {
    return `Today, ${date.toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProductIcon({ item }: { item: InventoryItem }) {
  const isOutOfStock = item.status === "out-of-stock";
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-xl bg-muted overflow-hidden p-2 flex items-center justify-center border border-border shrink-0",
        isOutOfStock && "grayscale"
      )}
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      ) : (
        <span className="material-symbols-outlined text-muted-foreground text-xl">
          inventory_2
        </span>
      )}
    </div>
  );
}

function MobileItemCard({
  item,
  deleteMode,
  selected,
  onClick,
  onSell,
}: {
  item: InventoryItem;
  index: number;
  deleteMode?: boolean;
  selected?: boolean;
  onClick: () => void;
  onSell?: (item: InventoryItem) => void;
}) {
  const isOutOfStock = item.status === "out-of-stock";

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border shadow-sm overflow-hidden cursor-pointer transition-all active:scale-[0.99]",
        deleteMode && selected
          ? "border-destructive/40 bg-destructive/5"
          : "border-border/60 hover:border-primary/20 hover:shadow-md",
        isOutOfStock && !deleteMode && "opacity-75"
      )}
      onClick={onClick}
    >
      <div className="p-3.5 flex items-center gap-3">
        {deleteMode && (
          <span
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
              selected
                ? "bg-destructive border-destructive"
                : "border-border bg-background"
            )}
          >
            {selected && (
              <span className="material-symbols-outlined text-[12px] text-white leading-none">
                check
              </span>
            )}
          </span>
        )}

        {/* Product thumbnail */}
        <div
          className={cn(
            "w-14 h-14 rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border/60 shrink-0",
            isOutOfStock && "grayscale"
          )}
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="material-symbols-outlined text-muted-foreground text-2xl">
              inventory_2
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: name + status badge */}
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-sm text-foreground leading-snug line-clamp-1">
              {item.name}
            </p>
            {!deleteMode && <StatusBadge status={item.status} />}
          </div>

          {/* Row 2: stock count */}
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Stock:{" "}
            <span
              className={cn(
                "font-black",
                isOutOfStock ? "text-destructive" : "text-foreground"
              )}
            >
              {item.stockCount} units
            </span>
          </p>

          {/* Row 3: price + sold button */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-black text-primary">{formatPHP(item.price)}</p>
            {!deleteMode && (
              <button
                disabled={isOutOfStock}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOutOfStock) onSell?.(item);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                  isOutOfStock
                    ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                    : "bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:scale-105 active:scale-95 cursor-pointer"
                )}
              >
                Sold
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdate?: (updated: InventoryItem) => void;
  onDelete?: (id: string) => void;
  onSell?: (item: InventoryItem) => void;
  deleteMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onSelectAll?: () => void;
  onProductModalOpen?: () => void;
  onProductModalClose?: () => void;
}

export function InventoryTable({
  items,
  onUpdate,
  onDelete,
  onSell,
  deleteMode = false,
  selectedIds = new Set(),
  onToggleSelect,
  onSelectAll,
  onProductModalOpen,
  onProductModalClose,
}: InventoryTableProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id));
  const someSelected = items.some((i) => selectedIds.has(i.id));

  function handleRowClick(item: InventoryItem) {
    if (deleteMode) {
      onToggleSelect?.(item.id);
    } else {
      setModal(item);
      onProductModalOpen?.();
    }
  }

  return (
    <>
      <ProductDetailsModal
        item={modal}
        onClose={() => { setModal(null); onProductModalClose?.(); }}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      {/* ── Mobile ─────────────────────────────────────────────────── */}
      <div className="md:hidden space-y-2.5 p-3">
        {deleteMode && (
          <div className="px-3 py-2.5 bg-destructive/5 rounded-xl border border-destructive/10 flex items-center gap-3">
            <button
              onClick={onSelectAll}
              className="flex items-center gap-2 text-xs font-black text-destructive"
            >
              <span
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  allSelected
                    ? "bg-destructive border-destructive"
                    : someSelected
                    ? "bg-destructive/30 border-destructive"
                    : "border-border bg-background"
                )}
              >
                {(allSelected || someSelected) && (
                  <span className="material-symbols-outlined text-[12px] text-white leading-none">
                    {allSelected ? "check" : "remove"}
                  </span>
                )}
              </span>
              {allSelected ? "Deselect All" : "Select All"}
            </button>
            {selectedIds.size > 0 && (
              <span className="text-[11px] text-muted-foreground ml-auto">
                {selectedIds.size} selected
              </span>
            )}
          </div>
        )}

        {items.map((item) => (
          <MobileItemCard
            key={item.id}
            item={item}
            index={0}
            deleteMode={deleteMode}
            selected={selectedIds.has(item.id)}
            onClick={() => handleRowClick(item)}
            onSell={onSell}
          />
        ))}
      </div>

      {/* ── Desktop ────────────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/40">
              {deleteMode && (
                <th className="pl-8 pr-2 py-5 w-10">
                  <button
                    onClick={onSelectAll}
                    aria-label={allSelected ? "Deselect all" : "Select all"}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                      allSelected
                        ? "bg-destructive border-destructive"
                        : someSelected
                        ? "bg-destructive/30 border-destructive"
                        : "border-border bg-background hover:border-destructive"
                    )}
                  >
                    {(allSelected || someSelected) && (
                      <span className="material-symbols-outlined text-[12px] text-white leading-none">
                        {allSelected ? "check" : "remove"}
                      </span>
                    )}
                  </button>
                </th>
              )}
              {HEADERS.map(({ label, className }) => (
                <th
                  key={label}
                  className={cn(
                    "px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground first:px-8 last:px-8",
                    className
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {items.map((item, i) => {
              const isOutOfStock = item.status === "out-of-stock";
              const isSelected = selectedIds.has(item.id);
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "transition-all duration-300 cursor-pointer",
                    deleteMode
                      ? isSelected
                        ? "bg-destructive/8 hover:bg-destructive/12"
                        : i % 2 === 0
                        ? "bg-card hover:bg-destructive/5"
                        : "bg-background/40 hover:bg-destructive/5"
                      : cn(
                          "hover:bg-primary/15",
                          isOutOfStock && "opacity-70",
                          i % 2 === 0 ? "bg-card" : "bg-background/40"
                        )
                  )}
                  onClick={() => handleRowClick(item)}
                >
                  {deleteMode && (
                    <td className="pl-8 pr-2 py-6">
                      <span
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-destructive border-destructive"
                            : "border-border bg-background"
                        )}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-[12px] text-white leading-none">
                            check
                          </span>
                        )}
                      </span>
                    </td>
                  )}

                  <td className={cn("py-6", deleteMode ? "px-4" : "px-8")}>
                    <div className="flex items-center gap-4">
                      <ProductIcon item={item} />
                      <div>
                        <p className="font-bold text-sm text-foreground leading-none mb-1.5">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-center">
                    <StatusBadge status={item.status} />
                  </td>

                  <td
                    className={cn(
                      "px-6 py-6 text-center font-bold text-sm",
                      isOutOfStock && "text-destructive"
                    )}
                  >
                    {item.stockCount} units
                  </td>

                  <td className="px-6 py-6 text-center text-xs text-muted-foreground">
                    {formatPHP(item.cost)}
                  </td>

                  <td className="px-6 py-6 text-center font-black text-sm text-primary">
                    {formatPHP(item.price)}
                  </td>

                  <td className="px-8 py-6 text-center text-xs text-muted-foreground font-medium">
                    {formatRestockDate(item.lastRestock)}
                  </td>

                  <td className="px-8 py-6 text-center text-xs font-medium">
                    {item.lastUpdated ? (
                      <span className="text-muted-foreground font-black">
                        {formatLastUpdated(item.lastUpdated)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>

                  <td className="px-6 py-6 text-center">
                    <button
                      disabled={isOutOfStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) onSell?.(item);
                      }}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                        isOutOfStock
                          ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                          : "bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:scale-105 active:scale-95 cursor-pointer"
                      )}
                    >
                      Sold
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
