"use client";

import { useState, useEffect } from "react";
import type { ManagedStore } from "@/app/types/stores";
import { StoreCard } from "./StoreCard";
import { StoreDetailsModal } from "./StoreDetailsModal";
import { MarketIntelligenceBanner } from "./MarketIntelligenceBanner";

const STORAGE_KEY = "sukitrack_stores";

interface StoreCatalogProps {
  initialStores: ManagedStore[];
}

export function StoreCatalog({ initialStores }: StoreCatalogProps) {
  const [stores, setStores] = useState<ManagedStore[]>(initialStores);
  const [selectedStore, setSelectedStore] = useState<ManagedStore | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ManagedStore[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStores(parsed);
        }
      }
    } catch {
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
    } catch {
    }
  }, [stores, hydrated]);

  function handleUpdate(updated: ManagedStore) {
    setStores((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  function handleRemove(id: string) {
    setStores((prev) => prev.filter((s) => s.id !== id));
  }

  const activeCount = stores.filter((s) => s.status === "active").length;

  return (
    <>
      <StoreDetailsModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />

      <div className="flex flex-col min-h-full">
        <div className="flex-1 px-6 md:px-10 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
                Managed Stores
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You are currently overseeing{" "}
                <span className="text-primary font-bold">
                  {activeCount} active location{activeCount !== 1 ? "s" : ""}
                </span>{" "}
                across Metro Manila.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all cursor-pointer whitespace-nowrap self-start">
              <span className="material-symbols-outlined text-sm">add_business</span>
              Add New Store
            </button>
          </div>

          <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-label="Store locations"
          >
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onManage={() => setSelectedStore(store)}
              />
            ))}
          </section>

          <MarketIntelligenceBanner />
        </div>
      </div>
    </>
  );
}
