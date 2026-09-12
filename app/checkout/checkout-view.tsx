"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrder } from "@/app/checkout/actions";
import { useCart } from "@/components/cart-provider";
import { cartDetails } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import type { Address } from "@/components/address-form";

export function CheckoutView({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const { lines, hydrated, clearCart } = useCart();
  const details = cartDetails(lines);
  const defaultAddress =
    addresses.find((address) => address.is_default) ?? addresses[0];
  const [addressId, setAddressId] = useState(defaultAddress?.id ?? 0);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const total = details.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );

  if (!hydrated)
    return (
      <div className="commerce-loading" aria-live="polite">
        Đang tải đơn hàng…
      </div>
    );
  if (details.length === 0)
    return (
      <div className="commerce-empty">
        <h2>Không có sản phẩm để đặt.</h2>
        <Link className="button button-primary" href="/shop">
          Xem sản phẩm
        </Link>
      </div>
    );
  if (addresses.length === 0)
    return (
      <div className="commerce-empty">
        <h2>Bạn chưa có địa chỉ giao hàng.</h2>
        <p>Lưu một địa chỉ rồi quay lại bước xác nhận đơn.</p>
        <Link className="button button-primary" href="/account/addresses">
          Thêm địa chỉ
        </Link>
      </div>
    );

  function submitOrder() {
    setError("");
    startTransition(async () => {
      const result = await placeOrder(addressId, lines);
      if (result.error || !result.orderId) {
        setError(result.error ?? "Chưa thể tạo đơn hàng.");
        return;
      }
      clearCart();
      router.push(`/order-success?id=${result.orderId}`);
    });
  }

  return (
    <div className="checkout-layout">
      <section className="checkout-main">
        <div className="checkout-step">
          <span>01</span>
          <div>
            <h2>Địa chỉ giao hàng</h2>
            <p>Chọn nơi shop sẽ gửi đơn.</p>
          </div>
          <Link href="/account/addresses">Quản lý địa chỉ</Link>
        </div>
        <fieldset className="address-options">
          <legend className="sr-only">Chọn địa chỉ giao hàng</legend>
          {addresses.map((address) => (
            <label
              className={addressId === address.id ? "selected" : ""}
              key={address.id}
            >
              <input
                type="radio"
                name="address"
                value={address.id}
                checked={addressId === address.id}
                onChange={() => setAddressId(address.id)}
              />
              <span>
                <strong>{address.recipient_name}</strong>
                <small>
                  {address.phone}
                  <br />
                  {address.address_line}, {address.ward}, {address.district},{" "}
                  {address.province}
                </small>
                {address.note ? <em>{address.note}</em> : null}
              </span>
              {address.is_default ? <b>Mặc định</b> : null}
            </label>
          ))}
        </fieldset>
        <div className="checkout-step">
          <span>02</span>
          <div>
            <h2>Xem lại sản phẩm</h2>
            <p>Giá được xác nhận lại khi tạo đơn.</p>
          </div>
          <Link href="/cart">Sửa giỏ hàng</Link>
        </div>
        <div className="review-lines">
          {details.map(({ product, quantity }) => (
            <div key={product.slug}>
              <span>
                <strong>{product.name}</strong>
                <small>
                  {quantity} × {formatPrice(product.price)}
                </small>
              </span>
              <b>{formatPrice(product.price * quantity)}</b>
            </div>
          ))}
        </div>
      </section>
      <aside className="order-summary checkout-summary">
        <p className="eyebrow">03 / Xác nhận</p>
        <div className="summary-line">
          <span>
            {details.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
          </span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <div className="summary-line">
          <span>Phí giao hàng</span>
          <strong>Xác nhận sau</strong>
        </div>
        <div className="summary-total">
          <span>Tổng hàng</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <p>
          Không có bước thanh toán online. Shop sẽ gọi xác nhận trước khi gửi
          hàng.
        </p>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <button
          className="button button-primary button-wide"
          type="button"
          disabled={pending}
          onClick={submitOrder}
        >
          {pending ? "Đang tạo đơn…" : "Xác nhận đặt hàng"}
        </button>
      </aside>
    </div>
  );
}
