"use client";

import { useActionState } from "react";
import { saveAddress } from "@/app/account/addresses/actions";
import { SubmitButton } from "@/components/submit-button";

export type Address = {
  id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  ward: string;
  district: string;
  province: string;
  note: string | null;
  is_default: boolean;
};

export function AddressForm({ address }: { address?: Address }) {
  const [state, action] = useActionState(saveAddress, {});
  return (
    <form className="address-form form-stack" action={action}>
      {address ? <input type="hidden" name="id" value={address.id} /> : null}
      <div className="form-grid">
        <label>
          Họ tên người nhận
          <input
            name="recipientName"
            type="text"
            defaultValue={address?.recipient_name}
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
            defaultValue={address?.phone}
            autoComplete="tel"
            maxLength={30}
            required
            placeholder="0901 234 567…"
          />
        </label>
      </div>
      <label>
        Địa chỉ
        <input
          name="addressLine"
          type="text"
          defaultValue={address?.address_line}
          autoComplete="address-line1"
          maxLength={240}
          required
          placeholder="Số nhà, tên đường…"
        />
      </label>
      <div className="form-grid form-grid-three">
        <label>
          Phường / Xã
          <input
            name="ward"
            type="text"
            defaultValue={address?.ward}
            autoComplete="address-level3"
            maxLength={120}
            required
            placeholder="Phường Bến Nghé…"
          />
        </label>
        <label>
          Quận / Huyện
          <input
            name="district"
            type="text"
            defaultValue={address?.district}
            autoComplete="address-level2"
            maxLength={120}
            required
            placeholder="Quận 1…"
          />
        </label>
        <label>
          Tỉnh / Thành phố
          <input
            name="province"
            type="text"
            defaultValue={address?.province}
            autoComplete="address-level1"
            maxLength={120}
            required
            placeholder="TP. Hồ Chí Minh…"
          />
        </label>
      </div>
      <label>
        Ghi chú
        <textarea
          name="note"
          defaultValue={address?.note ?? ""}
          maxLength={500}
          rows={3}
          placeholder="Hướng dẫn giao hàng nếu cần…"
        />
      </label>
      <label className="check-label">
        <input
          name="isDefault"
          type="checkbox"
          defaultChecked={address?.is_default}
        />{" "}
        Dùng làm địa chỉ mặc định
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
      <SubmitButton
        idle={address ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
        pending="Đang lưu…"
      />
    </form>
  );
}
