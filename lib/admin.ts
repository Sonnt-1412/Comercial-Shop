import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdminId } from "@/lib/admin-permissions";

export function isAdminId(userId: string) {
  return isAllowedAdminId(userId, process.env.ADMIN_USER_IDS);
}

export const requireAdmin = cache(async function requireAdmin() {
  const session = await createClient();
  const { data, error } = await session.auth.getUser();
  if (error || !data.user) redirect("/login?next=/admin");
  if (!isAdminId(data.user.id)) notFound();
  return data.user;
});

export function createAdminClient() {
  const key =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Thiếu SUPABASE_SECRET_KEY cho trang quản trị.");
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function adminContext() {
  const user = await requireAdmin();
  return { user, supabase: createAdminClient() };
}
