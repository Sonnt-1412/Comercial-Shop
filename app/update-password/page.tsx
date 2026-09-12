"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/update-password/actions";
import { SubmitButton } from "@/components/submit-button";

export default function UpdatePasswordPage() {
  const [state, action] = useActionState(updatePassword, {});
  return (
    <main className="auth-page shell" id="main-content">
      <section className="auth-panel">
        <p className="eyebrow">
          <span className="eyebrow-line" /> Account / New password
        </p>
        <h1>Mật khẩu mới</h1>
        <form className="form-stack" action={action}>
          <label>
            Mật khẩu mới
            <input
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
              placeholder="Tối thiểu 8 ký tự…"
            />
          </label>
          {state.error ? (
            <p className="form-error" role="alert">
              {state.error}
            </p>
          ) : null}
          <SubmitButton
            idle="Lưu mật khẩu"
            pending="Đang lưu…"
            className="button button-primary button-wide"
          />
        </form>
      </section>
    </main>
  );
}
