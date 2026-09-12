import type { Metadata } from "next";
import { AddressForm, type Address } from "@/components/address-form";
import {
  deleteAddress,
  setDefaultAddress,
} from "@/app/account/addresses/actions";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export const metadata: Metadata = { title: "Địa chỉ" };

export default async function AddressesPage() {
  await requireUser("/account/addresses");
  const supabase = await createClient();
  const { data } = await supabase
    .from("addresses")
    .select(
      "id, recipient_name, phone, address_line, ward, district, province, note, is_default",
    )
    .order("is_default", { ascending: false })
    .order("created_at");
  const addresses = (data ?? []) as Address[];
  return (
    <section>
      <div className="account-section-heading">
        <div>
          <span>02 / Delivery</span>
          <h2>Địa chỉ giao hàng</h2>
        </div>
      </div>
      <div className="address-list">
        {addresses.map((address) => (
          <details className="address-card" key={address.id}>
            <summary>
              <span>
                <strong>{address.recipient_name}</strong>
                <small>
                  {address.phone} · {address.address_line}, {address.ward},{" "}
                  {address.district}, {address.province}
                </small>
              </span>
              <span>{address.is_default ? "Mặc định" : "Chỉnh sửa"}</span>
            </summary>
            <AddressForm address={address} />
            <div className="address-card-actions">
              {!address.is_default ? (
                <form action={setDefaultAddress}>
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit">Đặt làm mặc định</button>
                </form>
              ) : null}
              <form action={deleteAddress}>
                <input type="hidden" name="id" value={address.id} />
                <ConfirmSubmitButton
                  className="danger-link"
                  message={`Xóa địa chỉ của ${address.recipient_name}?`}
                >
                  Xóa địa chỉ
                </ConfirmSubmitButton>
              </form>
            </div>
          </details>
        ))}
      </div>
      <div className="new-address">
        <h3>Thêm địa chỉ mới</h3>
        <AddressForm />
      </div>
    </section>
  );
}
