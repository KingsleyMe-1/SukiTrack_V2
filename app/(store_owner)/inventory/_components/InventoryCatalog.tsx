"use client";

import { useState, useMemo } from "react";
import type { InventoryItem, StockStatus, InventoryCategory } from "@/app/types/inventory";
import { FilterBar } from "./FilterBar";
import { InventoryTable } from "./InventoryTable";
import { Pagination } from "./Pagination";

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

  function handleUpdate(updated: InventoryItem) {
    setLocalItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  function handleDelete(id: string) {
    setLocalItems((prev) => prev.filter((i) => i.id !== id));
    setCurrentPage(1);
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

  function handleStatusChange(status: StockStatus | "all") {
    setStatusFilter(status);
    setCurrentPage(1);
  }

  function handleCategoryChange(category: InventoryCategory | "All Categories") {
    setCategoryFilter(category);
    setCurrentPage(1);
  }

  return (
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
        />
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
