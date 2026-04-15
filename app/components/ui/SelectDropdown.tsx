"use client";

import { useState, useRef } from "react";
import { cn } from "@/app/utils/cn";
import { useClickOutside } from "@/app/hooks/useClickOutside";

export interface SelectOption {
  value: string;
  label: string;
}


type SelectDropdownVariant = "filter" | "field";

interface SelectDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: SelectDropdownVariant;
  triggerIcon?: string;
  className?: string;
  panelClassName?: string;
  /**
   * Renders below the options list. Receives a `close` callback so footer
   * actions can close the dropdown programmatically.
   *
   * @example
   * footer={(close) => (
   *   <button onClick={() => { close(); doSomething(); }}>Add new…</button>
   * )}
   */
  footer?: (close: () => void) => React.ReactNode;
}

const TRIGGER_BASE = "w-full flex items-center gap-2 border transition-all cursor-pointer";

const TRIGGER_SIZE: Record<SelectDropdownVariant, string> = {
  filter: "px-3 py-1.5 rounded-lg text-[11px] font-bold min-w-[110px]",
  field: "px-4 py-2.5 rounded-xl text-sm font-medium",
};

const TRIGGER_IDLE: Record<SelectDropdownVariant, string> = {
  filter:
    "border-border bg-muted/40 text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
  field: "border-border bg-accent/30 text-foreground hover:border-primary/50",
};

const TRIGGER_OPEN: Record<SelectDropdownVariant, string> = {
  filter: "border-primary bg-primary/10 text-primary",
  field: "border-primary bg-primary/5 text-primary",
};

const PANEL_BASE =
  "absolute left-0 top-[calc(100%+6px)] min-w-full rounded-xl border bg-card overflow-hidden";

const PANEL_VARIANT: Record<SelectDropdownVariant, string> = {
  filter: "z-50 border-primary/30 shadow-lg",
  field: "z-[60] w-full border-primary/20 shadow-xl",
};

const OPTION_SIZE: Record<SelectDropdownVariant, string> = {
  filter: "text-[11px]",
  field: "text-[12px]",
};

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select…",
  variant = "filter",
  triggerIcon,
  className,
  panelClassName,
  footer,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside([ref], () => setOpen(false));

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? (value || placeholder);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          TRIGGER_BASE,
          TRIGGER_SIZE[variant],
          open ? TRIGGER_OPEN[variant] : TRIGGER_IDLE[variant]
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {triggerIcon && (
          <span
            className="material-symbols-outlined text-[15px] text-muted-foreground shrink-0"
            aria-hidden="true"
          >
            {triggerIcon}
          </span>
        )}
        <span className="flex-1 text-left truncate">{selectedLabel}</span>
        <span
          className={cn(
            "material-symbols-outlined text-base transition-transform duration-200 shrink-0",
            open ? "rotate-180" : "rotate-0"
          )}
          aria-hidden="true"
        >
          keyboard_arrow_down
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(PANEL_BASE, PANEL_VARIANT[variant], panelClassName)}
        >
          <div
            className={cn(
              "h-0.5 w-full",
              variant === "filter" ? "bg-primary/60" : "bg-primary/50"
            )}
          />
          <div className="py-1">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 font-semibold transition-colors cursor-pointer",
                    OPTION_SIZE[variant],
                    isSelected
                      ? "bg-primary/15 text-primary"
                      : "text-foreground/70 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {footer && (
            <>
              <div className="mx-3 border-t border-border" />
              <div className="py-1">{footer(() => setOpen(false))}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
