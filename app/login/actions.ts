"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth";
import { noticeUrl } from "@/lib/redirects";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string };

export async function signIn(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Nhập đầy đủ email và mật khẩu." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error)
    return { error: "Email hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại." };
  redirect(safeNext(formData.get("next")));
}

export async function signUp(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (fullName.length < 2) return { error: "Họ tên cần ít nhất 2 ký tự." };
  if (!email || password.length < 8)
    return { error: "Nhập email hợp lệ và mật khẩu từ 8 ký tự." };
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error)
    return {
      error: error.message.includes("already")
        ? "Email này đã được đăng ký."
        : "Chưa thể tạo tài khoản. Vui lòng thử lại.",
    };
  if (data.session) redirect(next);
  redirect(
    noticeUrl(
      "/login",
      "Kiểm tra email để xác nhận tài khoản trước khi đăng nhập.",
    ),
  );
}

export async function requestPasswordReset(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Nhập email đã dùng để đăng ký." };
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });
  if (error)
    return { error: "Chưa thể gửi email khôi phục. Vui lòng thử lại sau." };
  redirect(
    noticeUrl(
      "/login",
      "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.",
    ),
  );
}
