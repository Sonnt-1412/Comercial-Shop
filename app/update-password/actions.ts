"use server";

import { redirect } from "next/navigation";
import type { AuthState } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

export async function updatePassword(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Mật khẩu cần ít nhất 8 ký tự." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error)
    return { error: "Chưa thể đổi mật khẩu. Hãy mở lại liên kết trong email." };
  redirect("/account?notice=Mật khẩu đã được cập nhật.");
}
