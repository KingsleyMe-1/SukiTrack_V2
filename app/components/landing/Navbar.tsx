"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ThemeToggleButton } from "@/app/components/ui/ThemeToggleButton";
import { AuthModal } from "@/app/components/landing/AuthModal";
import Image from "next/image";

export function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"signin" | "signup">("signin");
  const searchParams = useSearchParams();

  // Auto-open sign-in modal if middleware redirected an unauthenticated request
  useEffect(() => {
    if (searchParams.get("auth_required") === "true") {
      setModalTab("signin");
      setModalOpen(true);
    }
  }, [searchParams]);

  function openSignIn() {
    setModalTab("signin");
    setModalOpen(true);
  }

  function openSignUp() {
    setModalTab("signup");
    setModalOpen(true);
  }

  return (
    <>
      <header className="w-full z-10 bg-background border-b border-border">
        <nav className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
          
          <Link href="/" className="text-xl font-extrabold tracking-tight text-on-surface flex items-center">
            <Image src="/suki-track-logo.png" alt="SukiTrack Logo" height={40} width={40} className="rounded-lg mr-2" />
            Suki<span className="text-primary">Track</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggleButton />
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={modalTab}
      />
    </>
  );
}
