import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import { formatPrice, type Product } from "@/lib/products";
import { ProductArt } from "@/components/product-art";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card" href={`/product/${product.slug}`}>
      <div className="product-card-art">
        {product.images?.[0] ? (
          <Image
            className="product-photo"
            src={product.images[0]}
            alt={product.name}
            width={420}
            height={330}
            unoptimized
          />
        ) : (
          <ProductArt art={product.art} accent={product.accent} compact />
        )}
        <span className="product-card-arrow">
          <ArrowUpRight />
        </span>
      </div>
      <div className="product-card-copy">
        <div>
          <span className="product-category">{product.categoryLabel}</span>
          <h3>{product.name}</h3>
        </div>
        <div className="product-price">
          <span>{formatPrice(product.price)}</span>
          <small
            className={product.status === "Hết hàng" ? "stock-unavailable" : ""}
          >
            {product.status}
          </small>
        </div>
      </div>
    </Link>
  );
}
