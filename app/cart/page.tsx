import type { Metadata } from "next";
import { CartView } from "@/app/cart/cart-view";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default function CartPage() {
  return (
    <main className="commerce-page shell" id="main-content">
      <div className="commerce-heading">
        <p className="eyebrow">
          <span className="eyebrow-line" /> Cart / Danh sách đã chọn
        </p>
        <h1>Giỏ hàng</h1>
      </div>
      <CartView />
    </main>
  );
}
