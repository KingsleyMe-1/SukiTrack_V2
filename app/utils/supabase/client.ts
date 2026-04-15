import { createBrowserClient } from "@supabase/ssr";

// Use this client inside Client Components ("use client" files).
// It reads NEXT_PUBLIC_ env vars which are safe to expose in the browser.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
