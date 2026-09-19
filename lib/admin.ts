import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdminId } from "@/lib/admin-permissions";
import { adminConfiguration } from "@/lib/admin-config";

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
  const { url, key, issue } = adminConfiguration(process.env);
  if (issue) throw new Error(issue);
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function adminContext() {
  const user = await requireAdmin();
  return { user, supabase: createAdminClient() };
}

export function adminReadError(
  operation: string,
  failure: { code?: string; status?: number } | null | undefined,
): never {
  // Log identifiers only: never include query data, customer details or keys.
  const code =
    failure?.code && /^[A-Z0-9_]{1,40}$/.test(failure.code)
      ? failure.code
      : "UNKNOWN";
  console.error("[admin.read]", { operation, code, status: failure?.status });
  throw new Error(`${operation} (${code})`);
}
