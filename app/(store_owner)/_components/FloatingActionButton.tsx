"use client";

import { useState } from "react";

export function FloatingActionButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      aria-label="Quick Add Entry"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 editorial-gradient text-on-primary w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
    >
      <span className="material-symbols-outlined text-2xl md:text-3xl">add</span>

      <div
        className={`absolute right-full mr-4 md:mr-6 pointer-events-none transition-all duration-200 ${
          hovered ? "opacity-100 -translate-x-0" : "opacity-0 translate-x-2"
        }`}
        aria-hidden="true"
      >
        <div className="bg-accent text-foreground border border-border text-[11px] font-bold px-4 py-2 rounded-xl shadow-xl whitespace-nowrap">
          Quick Add Entry
        </div>
      </div>
    </button>
  );
}
