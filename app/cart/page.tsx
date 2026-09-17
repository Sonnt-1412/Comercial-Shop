import type { Metadata } from "next";
import { CartView } from "@/app/cart/cart-view";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default async function CartPage() {
  const products = await getCatalogProducts();
  return (
    <main className="commerce-page shell" id="main-content">
      <div className="commerce-heading">
        <h1>Giỏ hàng</h1>
      </div>
      <CartView products={products} />
    </main>
  );
}
