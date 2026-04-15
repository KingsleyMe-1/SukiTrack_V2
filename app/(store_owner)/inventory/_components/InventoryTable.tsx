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
  index,
  deleteMode,
  selected,
  onClick,
}: {
  item: InventoryItem;
  index: number;
  deleteMode?: boolean;
  selected?: boolean;
  onClick: () => void;
}) {
  const isOutOfStock = item.status === "out-of-stock";
  return (
    <div
      className={cn(
        "px-4 py-4 cursor-pointer transition-colors",
        deleteMode
          ? selected
            ? "bg-destructive/8"
            : index % 2 === 0
            ? "bg-card hover:bg-destructive/5"
            : "bg-background/40 hover:bg-destructive/5"
          : cn(
              "hover:bg-primary/5",
              isOutOfStock && "opacity-70",
              index % 2 === 0 ? "bg-card" : "bg-background/40"
            )
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {deleteMode && (
          <span
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-1 shrink-0",
              selected ? "bg-destructive border-destructive" : "border-border bg-background"
            )}
          >
            {selected && (
              <span className="material-symbols-outlined text-[12px] text-white leading-none">
                check
              </span>
            )}
          </span>
        )}
        <ProductIcon item={item} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground leading-tight">{item.name}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
            {item.category}
          </p>
        </div>
        {!deleteMode && <StatusBadge status={item.status} />}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
            Stock
          </p>
          <p className={cn("font-bold text-sm", isOutOfStock ? "text-destructive" : "text-foreground")}>
            {item.stockCount}
            <span className="text-[10px] font-medium text-muted-foreground ml-0.5">units</span>
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
            Cost
          </p>
          <p className="text-xs text-muted-foreground">{formatPHP(item.cost)}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
            Price
          </p>
          <p className="font-black text-sm text-primary">{formatPHP(item.price)}</p>
        </div>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground font-medium">
        Last Restock: {formatRestockDate(item.lastRestock)}
      </p>
      {item.lastUpdated && (
        <p className="mt-1 text-[10px] font-medium">
          <span className="text-muted-foreground">Updated: </span>
          <span className="text-primary font-black">{formatLastUpdated(item.lastUpdated)}</span>
        </p>
      )}
    </div>
  );
}

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdate?: (updated: InventoryItem) => void;
  onDelete?: (id: string) => void;
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
      <div className="md:hidden divide-y divide-border/50">
        {deleteMode && (
          <div className="px-4 py-3 bg-destructive/5 border-b border-destructive/10 flex items-center gap-3">
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

        {items.map((item, i) => (
          <MobileItemCard
            key={item.id}
            item={item}
            index={i}
            deleteMode={deleteMode}
            selected={selectedIds.has(item.id)}
            onClick={() => handleRowClick(item)}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
