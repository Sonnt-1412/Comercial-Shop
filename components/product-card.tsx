import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { formatPrice, type Product } from "@/lib/products";
import { ProductArt } from "@/components/product-art";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return <Link className="product-card" href={`/product/${product.slug}`}>
    <div className="product-card-art"><ProductArt art={product.art} accent={product.accent} compact label={`0${index + 1} / 08`} />{product.badge && <span className="product-badge">{product.badge}</span>}<span className="product-card-arrow"><ArrowUpRight /></span></div>
    <div className="product-card-copy"><div><span className="product-category">{product.categoryLabel}</span><h3>{product.name}</h3></div><div className="product-price"><span>{formatPrice(product.price)}</span><small>{product.status}</small></div></div>
  </Link>;
}
