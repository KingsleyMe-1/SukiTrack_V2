"use client";

import { useState, useEffect } from "react";
import type { ManagedStore } from "@/app/types/stores";
import { cn } from "@/app/utils/cn";
import { InputField } from "@/app/components/ui/InputField";

interface FormState {
  name: string;
  location: string;
  dailyTarget: string;
  manager: string;
}

const DEFAULT_FORM: FormState = {
  name: "",
  location: "",
  dailyTarget: "",
  manager: "",
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-border bg-accent/30 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";


function ExpansionPanel() {
  return (
    <div className="relative w-full h-full min-h-[280px] overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f14] via-[#162a1c] to-[#0c1a11]" />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,white 0px,white 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,white 0px,white 1px,transparent 1px,transparent 48px)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-28 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--primary)" }}
      />

      {[22, 42, 60, 78].map((top) => (
        <div
          key={top}
          aria-hidden="true"
          className="absolute left-4 right-4 h-px bg-white/[0.07] rounded-full"
          style={{ top: `${top}%` }}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full animate-ping opacity-10"
            style={{ background: "var(--primary)", margin: "-12px" }}
          />
          <div className="w-20 h-20 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-sm"
            style={{ background: "color-mix(in oklch, var(--primary) 12%, transparent)" }}>
            <span className="material-symbols-outlined text-[40px]" style={{ color: "var(--primary)" }}>
              add_business
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="rounded-2xl border border-white/10 p-4"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)" }}>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-1"
            style={{ color: "var(--primary)" }}>
            Expansion
          </p>
          <p className="text-base font-black text-white leading-snug">
            Scale your vision across new borders.
          </p>
        </div>
      </div>
    </div>
  );
}

export interface AddStoreModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (store: ManagedStore) => void;
}

export function AddStoreModal({ open, onClose, onAdd }: AddStoreModalProps) {
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM });

  function handleClose() {
    setForm({ ...DEFAULT_FORM });
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const canSubmit = form.name.trim() !== "" && form.location.trim() !== "";

  function handleCreate() {
    if (!canSubmit) return;
    const newStore: ManagedStore = {
      id: `store-${Date.now()}`,
      name: form.name.trim(),
      location: form.location.trim(),
      status: "active",
      icon: "storefront",
      todaysSales: 0,
      creditAccounts: [],
      extraCreditCount: 0,
      stockLevelPercent: 0,
      stockLevelStatus: "optimal",
      dailyTarget: form.dailyTarget ? parseFloat(form.dailyTarget) : undefined,
      manager: form.manager.trim() || undefined,
      monthlyGrowthPercent: 0,
    };
    onAdd(newStore);
    handleClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Add New Store"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden sm:block sm:w-2/5 shrink-0">
          <ExpansionPanel />
        </div>

        <div className="flex-1 flex flex-col bg-card min-w-0">

          <div className="flex items-start justify-between px-6 pt-6 pb-5 sm:px-7 sm:pt-7 border-b border-border">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                Add New Store
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Configure your new location details to begin tracking performance.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 cursor-pointer ml-3"
              aria-label="Close dialog"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7 sm:py-6 space-y-4">
            <InputField label="Store Name">
              <input
                type="text"
                placeholder="e.g. Atelier Soho"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
                autoFocus
              />
            </InputField>

            <InputField label="Location">
              <input
                type="text"
                placeholder="Enter physical address"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className={inputClass}
              />
            </InputField>

            <InputField label="Daily Sales Target (₱)">
              <input
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={form.dailyTarget}
                onChange={(e) => setForm((p) => ({ ...p, dailyTarget: e.target.value }))}
                className={inputClass}
              />
            </InputField>

            <InputField label="Manager Name">
              <input
                type="text"
                placeholder="Full legal name"
                value={form.manager}
                onChange={(e) => setForm((p) => ({ ...p, manager: e.target.value }))}
                className={inputClass}
              />
            </InputField>
          </div>

          <div className="px-6 py-5 sm:px-7 border-t border-border">
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleCreate}
                disabled={!canSubmit}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                  canSubmit
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                    : "bg-primary/30 text-primary-foreground/50 cursor-not-allowed"
                )}
              >
                <span className="material-symbols-outlined text-[16px]">add_business</span>
                Create Store
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
