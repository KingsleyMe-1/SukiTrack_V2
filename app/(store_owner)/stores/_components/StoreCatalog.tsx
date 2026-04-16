"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ManagedStore } from "@/app/types/stores";
import { StoreCard } from "./StoreCard";
import { StoreDetailsModal } from "./StoreDetailsModal";
import { AddStoreModal } from "./AddStoreModal";
import { MarketIntelligenceBanner } from "./MarketIntelligenceBanner";
import {
  createStoreAction,
  updateStoreAction,
  deleteStoreAction,
} from "../actions";

interface StoreCatalogProps {
  initialStores: ManagedStore[];
}

export function StoreCatalog({ initialStores }: StoreCatalogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedStore, setSelectedStore] = useState<ManagedStore | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  async function handleAdd(newStore: ManagedStore) {
    await createStoreAction({
      name: newStore.name,
      location: newStore.location,
      dailyTarget: newStore.dailyTarget,
      manager: newStore.manager,
    });
    startTransition(() => router.refresh());
  }

  async function handleUpdate(updated: ManagedStore) {
    await updateStoreAction(updated.id, {
      name: updated.name,
      location: updated.location,
      dailyTarget: updated.dailyTarget,
      manager: updated.manager,
    });
    startTransition(() => router.refresh());
  }

  async function handleRemove(id: string) {
    await deleteStoreAction(id);
    startTransition(() => router.refresh());
  }

  const stores = initialStores;
  const activeCount = stores.filter((s) => s.status === "active").length;

  return (
    <>
      <StoreDetailsModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
      <AddStoreModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
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
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all cursor-pointer whitespace-nowrap self-start"
            >
              <span className="material-symbols-outlined text-sm">add_business</span>
              Add New Store
            </button>
          </div>

          <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-label="Store locations"
          >
            {stores.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-3">
                <span className="material-symbols-outlined text-5xl text-muted-foreground/40">storefront</span>
                <p className="text-sm font-semibold text-muted-foreground">No stores yet</p>
                <p className="text-xs text-muted-foreground/60">Add your first store location to start tracking performance.</p>
              </div>
            ) : (
              stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onManage={() => setSelectedStore(store)}
                />
              ))
            )}
          </section>

          {/* <MarketIntelligenceBanner /> */}
        </div>
      </div>
    </>
  );
}
