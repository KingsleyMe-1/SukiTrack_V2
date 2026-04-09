"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Support", href: "#support" },
] as const;

export function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="w-full z-10 bg-background border-b border-on-surface/8">
      <nav className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-on-surface">
          Suki<span className="text-primary">Track</span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "text-primary font-semibold hover:bg-primary/8"
                  : "text-on-surface/60 hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="p-2.5 rounded-full hover:bg-surface-container-low text-on-surface transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">
              {dark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="md:hidden p-2.5 rounded-full hover:bg-surface-container-low text-on-surface transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-on-surface/8 bg-background px-4 py-3 space-y-0.5">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                i === 0
                  ? "text-primary bg-primary/8 font-semibold"
                  : "text-on-surface/65 hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
