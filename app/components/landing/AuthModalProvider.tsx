"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AuthModal } from "@/app/components/landing/AuthModal";

interface AuthModalContextValue {
  openSignIn: () => void;
  openSignUp: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside AuthModalProvider");
  return ctx;
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  const openSignIn = useCallback(() => { setTab("signin"); setOpen(true); }, []);
  const openSignUp = useCallback(() => { setTab("signup"); setOpen(true); }, []);

  return (
    <AuthModalContext.Provider value={{ openSignIn, openSignUp }}>
      {children}
      <AuthModal isOpen={open} onClose={() => setOpen(false)} defaultTab={tab} />
    </AuthModalContext.Provider>
  );
}
