"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { AuthState } from "@/app/login/actions";
import { SubmitButton } from "@/components/submit-button";

export function AuthForm({
  action,
  mode,
  next = "/account",
}: {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  mode: "login" | "register" | "forgot" | "resend";
  next?: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const isLogin = mode === "login";
  const isRegister = mode === "register";

  return (
    <form className="auth-form form-stack" action={formAction}>
      <input type="hidden" name="next" value={next} />
      {isRegister ? (
        <label>
          Họ và tên
          <input
            name="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            minLength={2}
            maxLength={120}
            required
            placeholder="Nguyễn Văn A…"
          />
        </label>
      ) : null}
      <label>
        Email
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          placeholder="ban@example.com…"
        />
      </label>
      {mode !== "forgot" && mode !== "resend" ? (
        <label>
          Mật khẩu
          <input
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={8}
            required
            placeholder="Tối thiểu 8 ký tự…"
          />
        </label>
      ) : null}
      {isRegister ? (
        <label>
          Nhập lại mật khẩu
          <input
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            placeholder="Nhập lại mật khẩu…"
          />
        </label>
      ) : null}
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <SubmitButton
        idle={
          isLogin
            ? "Đăng nhập"
            : isRegister
              ? "Tạo tài khoản"
              : mode === "resend"
                ? "Gửi lại email xác nhận"
                : "Gửi liên kết khôi phục"
        }
        pending="Đang xử lý…"
        className="button button-primary button-wide"
      />
      {isLogin ? (
        <div className="auth-links">
          <Link href="/forgot-password">Quên mật khẩu?</Link>
          <Link href="/resend-confirmation">Gửi lại email xác nhận</Link>
          <Link href={`/register?next=${encodeURIComponent(next)}`}>
            Tạo tài khoản
          </Link>
        </div>
      ) : null}
      {isRegister ? (
        <p className="auth-switch">
          Đã có tài khoản?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`}>
            Đăng nhập
          </Link>
        </p>
      ) : null}
      {mode === "forgot" || mode === "resend" ? (
        <p className="auth-switch">
          <Link href="/login">Quay lại đăng nhập</Link>
        </p>
      ) : null}
    </form>
  );
}
