"use client";

import Link from "next/link";
import { ThemeToggleButton } from "@/app/components/ui/ThemeToggleButton";

export function Navbar() {
  return (
    <header className="w-full z-10 bg-background border-b border-border">
      <nav className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-on-surface">
          Suki<span className="text-primary">Track</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggleButton />
        </div>
      </nav>
    </header>
  );
}
