"use client";

import { cn } from "@/app/utils/cn";

interface HeaderProps {
  deleteMode: boolean;
  selectedCount: number;
  onDeleteModeToggle: () => void;
  onDeleteSelected: () => void;
  onBulkRestock: () => void;
}

function Header({
  deleteMode,
  selectedCount,
  onDeleteModeToggle,
  onDeleteSelected,
  onBulkRestock,
}: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-6 md:px-10 py-4">
      <div>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Inventory Control
        </h2>
        <p className="text-muted-foreground font-medium mt-1 text-[10px] uppercase tracking-widest opacity-70">
          Real-Time Stock Monitoring &amp; Logistics
        </p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        {deleteMode ? (
          <>
            <button
              onClick={onDeleteModeToggle}
              className="flex-1 md:flex-none px-5 py-2.5 border border-border text-muted-foreground hover:bg-muted rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Cancel
            </button>
            <button
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
              className={cn(
                "flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2",
                selectedCount > 0
                  ? "bg-destructive text-destructive-foreground hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                  : "bg-destructive/20 text-destructive/50 cursor-not-allowed"
              )}
            >
              <span className="material-symbols-outlined text-sm">delete_forever</span>
              Delete{selectedCount > 0 ? ` (${selectedCount})` : ""}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onDeleteModeToggle}
              className="flex-1 md:flex-none px-5 py-2.5 border border-destructive/30 text-destructive hover:bg-destructive/5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Delete Item
            </button>
            <button
              onClick={onBulkRestock}
              className="flex-1 md:flex-none bg-primary text-primary-foreground text-xs font-bold px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">inventory</span>
              Bulk Restock
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
