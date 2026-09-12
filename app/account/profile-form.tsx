"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/account/actions";
import { SubmitButton } from "@/components/submit-button";

export function ProfileForm({
  email,
  fullName,
  phone,
}: {
  email: string;
  fullName: string;
  phone: string;
}) {
  const [state, action] = useActionState(updateProfile, {});
  return (
    <form className="form-stack account-form" action={action}>
      <label>
        Email
        <input type="email" value={email} disabled readOnly />
      </label>
      <label>
        Họ và tên
        <input
          name="fullName"
          type="text"
          defaultValue={fullName}
          autoComplete="name"
          minLength={2}
          maxLength={120}
          required
          placeholder="Nguyễn Văn A…"
        />
      </label>
      <label>
        Số điện thoại
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          defaultValue={phone}
          autoComplete="tel"
          maxLength={30}
          placeholder="0901 234 567…"
        />
      </label>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="form-success" role="status">
          {state.success}
        </p>
      ) : null}
      <SubmitButton idle="Lưu thông tin" pending="Đang lưu…" />
    </form>
  );
}
