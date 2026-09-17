import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ArrowUpRight } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/products";
import { getCatalogProducts } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getCatalogProducts()).find(
    (item) => item.slug === slug,
  );
  return { title: product?.name ?? "Sản phẩm" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getCatalogProducts();
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products
    .filter(
      (item) =>
        item.slug !== product.slug && item.category === product.category,
    )
    .slice(0, 3);

  return (
    <main className="product-page shell" id="main-content">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link href="/shop">Sản phẩm</Link>
        <span>/</span>
        <Link href={`/category/${product.category}`}>
          {product.categoryLabel}
        </Link>
        <span>/</span>
        <span>{product.shortName}</span>
      </nav>
      <div className="product-detail">
        <div className="product-detail-visual">
          {product.images?.[0] ? (
            <Image
              className="product-photo detail-photo"
              src={product.images[0]}
              alt={product.name}
              width={840}
              height={660}
              unoptimized
            />
          ) : (
            <ProductArt art={product.art} accent={product.accent} />
          )}
          {product.images && product.images.length > 1 ? (
            <div className="detail-thumb-row">
              {product.images.slice(1).map((url, index) => (
                <div className="detail-thumb active" key={url}>
                  <Image
                    className="product-photo"
                    src={url}
                    alt={`${product.name}, ảnh ${index + 2}`}
                    width={180}
                    height={140}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="product-detail-copy">
          <div className="detail-topline">
            <span className="eyebrow">
              <span className="eyebrow-line" /> {product.categoryLabel}
            </span>
            <span
              className={`stock-status ${product.status === "Hết hàng" ? "stock-unavailable" : ""}`}
            >
              <span className="availability-dot" /> {product.status}
            </span>
          </div>
          <h1>{product.name}</h1>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-actions">
            <AddToCartButton
              slug={product.slug}
              disabled={product.stock === 0}
            />
            <Link className="text-link" href="/cart">
              Xem giỏ hàng
            </Link>
          </div>
          <div className="specs">
            <div className="specs-heading">
              <span>Thông số</span>
              <span>01 — 0{product.specs.length}</span>
            </div>
            {product.specs.map((spec) => (
              <div className="spec-row" key={spec.label}>
                <span>{spec.label}</span>
                <strong>{spec.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="related-products">
          <div className="section-heading compact-heading">
            <h2>Sản phẩm cùng danh mục</h2>
            <Link className="text-link" href={`/category/${product.category}`}>
              Xem thêm <ArrowUpRight />
            </Link>
          </div>
          <div className="product-grid related-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
