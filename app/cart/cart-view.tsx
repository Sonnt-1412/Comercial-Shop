"use client";

import Link from "next/link";
import Image from "next/image";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { useCart } from "@/components/cart-provider";
import { cartDetails, hasUnavailableItems } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/products";

export function CartView({ products }: { products: Product[] }) {
  const { lines, hydrated, setQuantity, removeItem } = useCart();
  const details = cartDetails(lines, products);
  const total = details.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );
  const unavailable = hasUnavailableItems(details);

  if (!hydrated)
    return (
      <div className="commerce-loading" aria-live="polite">
        Đang tải giỏ hàng…
      </div>
    );
  if (details.length === 0)
    return (
      <div className="commerce-empty">
        <h2>Giỏ hàng đang trống.</h2>
        <Link className="button button-primary" href="/shop">
          Xem sản phẩm
        </Link>
      </div>
    );

  return (
    <div className="cart-layout">
      <div className="cart-list">
        {details.map(({ product, quantity }) => (
          <article className="cart-row" key={product.slug}>
            <Link
              className="cart-art"
              href={`/product/${product.slug}`}
              aria-label={`Xem ${product.name}`}
            >
              {product.images?.[0] ? (
                <Image
                  className="product-photo"
                  src={product.images[0]}
                  alt=""
                  width={105}
                  height={82}
                  unoptimized
                />
              ) : (
                <ProductArt art={product.art} accent={product.accent} compact />
              )}
            </Link>
            <div className="cart-copy">
              <span className="product-category">{product.categoryLabel}</span>
              <h2>
                <Link href={`/product/${product.slug}`}>{product.name}</Link>
              </h2>
              <span className="cart-unit-price">
                {formatPrice(product.price)}
              </span>
            </div>
            <div
              className="quantity-control"
              aria-label={`Số lượng ${product.name}`}
            >
              <button
                type="button"
                aria-label={`Giảm số lượng ${product.name}`}
                onClick={() => setQuantity(product.slug, quantity - 1)}
              >
                <MinusIcon />
              </button>
              <output aria-live="polite">{quantity}</output>
              <button
                type="button"
                aria-label={`Tăng số lượng ${product.name}`}
                disabled={quantity >= Math.min(99, product.stock ?? 99)}
                onClick={() => setQuantity(product.slug, quantity + 1)}
              >
                <PlusIcon />
              </button>
            </div>
            <strong className="cart-line-total">
              {formatPrice(product.price * quantity)}
            </strong>
            <button
              className="remove-button"
              type="button"
              aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
              onClick={() => {
                if (window.confirm(`Xóa “${product.name}” khỏi giỏ hàng?`))
                  removeItem(product.slug);
              }}
            >
              <TrashIcon />
            </button>
          </article>
        ))}
      </div>
      <aside className="order-summary" aria-label="Tóm tắt giỏ hàng">
        <div className="summary-line">
          <span>Tạm tính</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <div className="summary-line">
          <span>Giao hàng</span>
          <strong>Xác nhận sau</strong>
        </div>
        <div className="summary-total">
          <span>Tổng</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <p>
          Không thanh toán online. Shop sẽ liên hệ để xác nhận đơn và phí giao
          hàng.
        </p>
        {unavailable ? (
          <p className="form-error" role="alert">
            Một sản phẩm đã hết hàng hoặc không đủ số lượng. Hãy giảm số lượng
            trước khi đặt.
          </p>
        ) : (
          <Link className="button button-primary button-wide" href="/checkout">
            Tiếp tục đặt hàng
          </Link>
        )}
        <Link className="text-link summary-back" href="/shop">
          Tiếp tục mua sắm
        </Link>
      </aside>
    </div>
  );
}
