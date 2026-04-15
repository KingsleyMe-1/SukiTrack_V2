"use client";

import { useState, useMemo } from "react";
import type { InventoryItem, StockStatus, InventoryCategory } from "@/app/types/inventory";
import { FilterBar } from "./FilterBar";
import { InventoryTable } from "./InventoryTable";
import { Pagination } from "./Pagination";
import { BulkRestockModal } from "./BulkRestockModal";
import { AddItemModal } from "./AddItemModal";
import Header from "./Header";
import { FloatingActionButton } from "@/app/(store_owner)/_components/FloatingActionButton";

const ITEMS_PER_PAGE = 8;

const STATUS_FILTERS: { label: string; value: StockStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Low Stock", value: "low-stock" },
  { label: "Healthy", value: "healthy" },
  { label: "Out of Stock", value: "out-of-stock" },
];

interface InventoryCatalogProps {
  items: InventoryItem[];
  categories: InventoryCategory[];
}

export function InventoryCatalog({ items, categories }: InventoryCatalogProps) {
  const [localItems, setLocalItems] = useState<InventoryItem[]>(items);
  const [statusFilter, setStatusFilter] = useState<StockStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | "All Categories">(
    "All Categories"
  );
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddItem, setShowAddItem] = useState(false);

  const [showBulkRestock, setShowBulkRestock] = useState(false);

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function handleAdd(newItem: InventoryItem) {
    setLocalItems((prev) => [newItem, ...prev]);
  }

  function handleUpdate(updated: InventoryItem) {
    setLocalItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  function handleDelete(id: string) {
    setLocalItems((prev) => prev.filter((i) => i.id !== id));
    setCurrentPage(1);
  }

  function handleToggleDeleteMode() {
    setDeleteMode((prev) => !prev);
    setSelectedIds(new Set());
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDeleteSelected() {
    setLocalItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
    setDeleteMode(false);
    setCurrentPage(1);
  }

  function handleBulkRestockConfirm(
    entries: { item: InventoryItem; quantity: number; newCost: string }[]
  ) {
    const today = new Date().toISOString().split("T")[0];
    setLocalItems((prev) =>
      prev.map((item) => {
        const entry = entries.find((e) => e.item.id === item.id);
        if (!entry) return item;
        const newStock = item.stockCount + entry.quantity;
        const updatedCost =
          entry.newCost !== "" ? parseFloat(entry.newCost) : item.cost;
        return {
          ...item,
          stockCount: newStock,
          cost: updatedCost,
          lastRestock: today,
          status:
            newStock === 0
              ? "out-of-stock"
              : newStock < 20
              ? "low-stock"
              : "healthy",
        };
      })
    );
  }

  const filtered = useMemo(() => {
    return localItems.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All Categories" || item.category === categoryFilter;
      return matchesStatus && matchesCategory;
    });
  }, [localItems, statusFilter, categoryFilter]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  function handleSelectAll() {
    const visibleIds = paginated.map((i) => i.id);
    const allSelected = visibleIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }

  function handleStatusChange(status: StockStatus | "all") {
    setStatusFilter(status);
    setCurrentPage(1);
  }

  function handleCategoryChange(category: InventoryCategory | "All Categories") {
    setCategoryFilter(category);
    setCurrentPage(1);
  }

  return (
    <>
      <AddItemModal
        open={showAddItem}
        onClose={() => setShowAddItem(false)}
        onAdd={handleAdd}
      />

      <BulkRestockModal
        open={showBulkRestock}
        allItems={localItems}
        onClose={() => setShowBulkRestock(false)}
        onConfirm={(entries) => {
          handleBulkRestockConfirm(entries);
          setShowBulkRestock(false);
        }}
      />

      <Header
        deleteMode={deleteMode}
        selectedCount={selectedIds.size}
        onDeleteModeToggle={handleToggleDeleteMode}
        onDeleteSelected={handleDeleteSelected}
        onBulkRestock={() => setShowBulkRestock(true)}
      />

      <div className="space-y-6">
        <FilterBar
          statusFilters={STATUS_FILTERS}
          selectedStatus={statusFilter}
          onStatusChange={handleStatusChange}
          categories={categories}
          selectedCategory={categoryFilter}
          onCategoryChange={handleCategoryChange}
        />

        <div className="bg-card rounded-3xl border border-border shadow overflow-hidden mb-12">
          <InventoryTable
            items={paginated}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            deleteMode={deleteMode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <FloatingActionButton onClick={() => setShowAddItem(true)} />
    </>
  );
}
