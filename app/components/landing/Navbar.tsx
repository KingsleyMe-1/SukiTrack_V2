"use client";

import { useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggleButton } from "@/app/components/ui/ThemeToggleButton";
import { useAuthModal } from "@/app/components/landing/AuthModalProvider";
import Image from "next/image";

function AuthModalController({
  onAuthRequired,
}: {
  onAuthRequired: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("auth_required") === "true") {
      onAuthRequired();
      router.replace("/", { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function Navbar() {
  const { openSignIn } = useAuthModal();

  const handleAuthRequired = useCallback(() => {
    openSignIn();
  }, [openSignIn]);

  return (
    <>
      <Suspense fallback={null}>
        <AuthModalController onAuthRequired={handleAuthRequired} />
      </Suspense>

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
    </>
  );
}
