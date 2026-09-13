"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth";
import { noticeUrl } from "@/lib/redirects";
import { siteUrl } from "@/lib/site-url";
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
  const passwordConfirmation = String(
    formData.get("passwordConfirmation") ?? "",
  );
  const next = safeNext(formData.get("next"));
  if (fullName.length < 2) return { error: "Họ tên cần ít nhất 2 ký tự." };
  if (!email || password.length < 8)
    return { error: "Nhập email hợp lệ và mật khẩu từ 8 ký tự." };
  if (password !== passwordConfirmation)
    return { error: "Hai mật khẩu chưa trùng khớp." };
  const supabase = await createClient();
  const origin = siteUrl((await headers()).get("origin"));
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
      "Nếu đây là tài khoản mới, hãy kiểm tra email để xác nhận. Nếu email đã có tài khoản, hãy đăng nhập hoặc khôi phục mật khẩu.",
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
  const origin = siteUrl((await headers()).get("origin"));
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

export async function resendConfirmation(
  _: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Nhập email đã dùng để đăng ký." };

  const supabase = await createClient();
  const origin = siteUrl((await headers()).get("origin"));
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/account`,
    },
  });

  if (error)
    return {
      error:
        error.status === 429
          ? "Vui lòng chờ ít nhất một phút trước khi gửi lại."
          : "Chưa thể gửi lại email xác nhận. Vui lòng thử lại sau.",
    };

  redirect(
    noticeUrl(
      "/login",
      "Nếu tài khoản chưa được xác nhận, email mới đã được gửi. Tài khoản đã xác nhận sẽ không nhận thêm email; hãy đăng nhập hoặc khôi phục mật khẩu.",
    ),
  );
}
