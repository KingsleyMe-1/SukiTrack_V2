"use client";

import { useState, useEffect } from "react";
import type { ManagedStore } from "@/app/types/stores";
import { cn } from "@/app/utils/cn";

interface FormState {
  name: string;
  location: string;
  dailyTarget: number;
  manager: string;
}

interface StoreDetailsModalProps {
  store: ManagedStore | null;
  onClose: () => void;
  onUpdate?: (updated: ManagedStore) => void;
  onRemove?: (id: string) => void;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-border bg-accent/30 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";

function InputField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function StorePlaceholder({ store }: { store: ManagedStore }) {
  const growth = store.monthlyGrowthPercent;

  return (
    <div className="relative w-full h-full min-h-[260px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2a1a] via-[#1e301e] to-[#121f12]" />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 40px)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full blur-3xl opacity-20 bg-white"
      />

      {[20, 40, 58, 74].map((top) => (
        <div
          key={top}
          aria-hidden="true"
          className="absolute left-4 right-4 h-px bg-white/10 rounded-full"
          style={{ top: `${top}%` }}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center backdrop-blur-sm">
          <span className="material-symbols-outlined text-white/40 text-[44px]">
            {store.icon ?? "storefront"}
          </span>
        </div>
      </div>

      {growth !== undefined && (
        <div className="absolute bottom-5 left-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">
            Monthly Growth
          </p>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-sm leading-none">
              trending_up
            </span>
            <p
              className={cn(
                "text-base font-black leading-none",
                growth >= 0 ? "text-primary" : "text-destructive"
              )}
            >
              {growth >= 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function StoreDetailsModal({
  store,
  onClose,
  onUpdate,
  onRemove,
}: StoreDetailsModalProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    location: "",
    dailyTarget: 0,
    manager: "",
  });
  const [confirmRemove, setConfirmRemove] = useState(false);

  const [syncedStoreId, setSyncedStoreId] = useState<string | null>(null);

  if (store && store.id !== syncedStoreId) {
    setSyncedStoreId(store.id);
    setForm({
      name: store.name,
      location: store.location,
      dailyTarget: store.dailyTarget ?? 0,
      manager: store.manager ?? "",
    });
    setConfirmRemove(false);
  }

  useEffect(() => {
    if (!store) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [store, onClose]);

  if (!store) return null;

  function handleUpdate() {
    if (!store) return;
    onUpdate?.({ ...store, ...form });
    onClose();
  }

  function handleRemove() {
    if (!store) return;
    onRemove?.(store.id);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Manage Store Details"
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden sm:block sm:w-2/5 shrink-0">
          <StorePlaceholder store={store} />
        </div>

        <div className="flex-1 flex flex-col bg-card min-w-0">
          <div className="px-7 pt-7 pb-5 border-b border-border">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <h2 className="text-2xl font-black text-foreground leading-tight">
              Manage Details
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Refining administration for{" "}
              <span className="text-foreground font-semibold">{store.name}</span>.
            </p>
          </div>

          <div className="px-7 py-6 space-y-4 overflow-y-auto flex-1">
            <InputField label="Store Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
              />
            </InputField>

            <InputField label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className={inputClass}
              />
            </InputField>

            <div className="grid grid-cols-2 gap-3">
              <InputField label="Daily Target (₱)">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.dailyTarget}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      dailyTarget: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className={inputClass}
                />
              </InputField>

              <InputField label="Manager">
                <input
                  type="text"
                  value={form.manager}
                  onChange={(e) => setForm((p) => ({ ...p, manager: e.target.value }))}
                  className={inputClass}
                />
              </InputField>
            </div>
          </div>

          <div className="px-7 py-5 border-t border-border">
            {confirmRemove ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-foreground">Remove this store?</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setConfirmRemove(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-black text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-black hover:scale-[1.02] active:scale-95 transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-[14px]">delete_forever</span>
                  Yes, Remove
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setConfirmRemove(true)}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-destructive hover:text-destructive/70 transition-colors cursor-pointer"
                  aria-label="Remove store"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Remove
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-black px-6 py-3 rounded-xl shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  Update Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
