"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { GlassCard } from "@/app/components/ui/GlassCard";
import { InputField } from "@/app/components/ui/InputField";
import { cn } from "@/app/utils/cn";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

type Tab = "signin" | "signup";

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setError(null);
      setSuccess(null);
      setEmail("");
      setPassword("");
      setFullName("");
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const inputClass =
    "w-full bg-background border border-input text-foreground placeholder-muted-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all";

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
    onClose();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess("Check your email to confirm your account, then sign in.");
    setTab("signin");
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <GlassCard className="w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="mb-6 text-center">
          <p className="text-xl font-extrabold tracking-tight text-foreground">
            Suki<span className="text-primary">Track</span>
          </p>
          <p id="auth-modal-title" className="text-sm text-muted-foreground mt-1 font-medium">
            {tab === "signin" ? "Welcome back, store owner." : "Create your account."}
          </p>
        </div>

        <div className="flex bg-muted rounded-xl p-1 mb-6 gap-1">
          {(["signin", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSuccess(null); }}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                tab === t
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {success && (
          <div className="mb-4 flex items-start gap-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl px-4 py-3 text-sm font-medium">
            <span className="material-symbols-outlined text-base mt-0.5 shrink-0">check_circle</span>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm font-medium">
            <span className="material-symbols-outlined text-base mt-0.5 shrink-0">error</span>
            {error}
          </div>
        )}

        {tab === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <InputField label="Email address">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </InputField>

            <InputField label="Password">
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </InputField>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-br from-chart-4 to-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <InputField label="Full name">
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Erlinda Digman"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </InputField>

            <InputField label="Email address">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </InputField>

            <InputField label="Password">
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </InputField>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-br from-chart-4 to-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        )}

        <p className="text-center text-[11px] text-muted-foreground mt-5">
          {tab === "signin" ? (
            <>No account?{" "}
              <button onClick={() => setTab("signup")} className="text-primary font-semibold hover:underline">
                Sign up free
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => setTab("signin")} className="text-primary font-semibold hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </GlassCard>
    </div>
  );
}
