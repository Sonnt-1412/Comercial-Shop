"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/icons";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    addItem(slug);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button className="button button-primary" type="button" onClick={add}>
      {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
      <PlusIcon />
      <span className="sr-only" aria-live="polite">
        {added ? "Sản phẩm đã được thêm vào giỏ hàng" : ""}
      </span>
    </button>
  );
}
