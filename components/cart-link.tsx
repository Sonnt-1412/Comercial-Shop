"use client";

import Link from "next/link";
import { CartIcon } from "@/components/icons";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { count, hydrated } = useCart();
  const visibleCount = hydrated ? count : 0;
  return (
    <Link
      className="cart-link"
      href="/cart"
      aria-label={`Giỏ hàng, ${visibleCount} sản phẩm`}
    >
      <CartIcon />
      <span>Giỏ hàng</span>
      <strong aria-live="polite">{visibleCount}</strong>
    </Link>
  );
}
