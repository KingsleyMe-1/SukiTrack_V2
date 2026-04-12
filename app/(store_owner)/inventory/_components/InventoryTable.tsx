import type { InventoryItem } from "@/app/types/inventory";
import { formatPHP } from "@/app/utils/format";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/app/utils/cn";
import Image from "next/image";

const HEADERS = [
  { label: "Product Name", className: "text-left" },
  { label: "Status", className: "text-center" },
  { label: "Stock Level", className: "text-center" },
  { label: "Cost", className: "text-center" },
  { label: "Price", className: "text-center" },
  { label: "Last Restock", className: "text-center" },
] as const;

function formatRestockDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-PH", {
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

function MobileItemCard({ item, index }: { item: InventoryItem; index: number }) {
  const isOutOfStock = item.status === "out-of-stock";
  return (
    <div
      className={cn(
        "px-4 py-4 cursor-pointer transition-colors hover:bg-primary/5",
        isOutOfStock && "opacity-70",
        index % 2 === 0 ? "bg-card" : "bg-background/40"
      )}
    >
      <div className="flex items-start gap-3">
        <ProductIcon item={item} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground leading-tight">{item.name}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
            {item.category}
          </p>
        </div>
        <StatusBadge status={item.status} />
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
    </div>
  );
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  return (
    <>
      <div className="md:hidden divide-y divide-border/50">
        {items.map((item, i) => (
          <MobileItemCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/40">
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
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "hover:bg-primary/15 transition-all duration-300 cursor-pointer",
                    isOutOfStock && "opacity-70",
                    i % 2 === 0 ? "bg-card" : "bg-background/40"
                  )}
                >
                  <td className="px-8 py-6">
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
                  <td className="px-6 py-6 text-center font-black text-sm text-primary">
                    {formatPHP(item.price)}
                  </td>

                  <td className="px-8 py-6 text-center text-xs text-muted-foreground font-medium">
                    {formatRestockDate(item.lastRestock)}
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
