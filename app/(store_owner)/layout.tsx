import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import { DashboardShell } from "./_components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?auth_required=true");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
