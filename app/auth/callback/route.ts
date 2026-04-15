import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

// Handles the OAuth / magic-link code exchange that Supabase
// redirects back to after a user completes email confirmation.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Exchange failed — redirect to landing with an error hint
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
