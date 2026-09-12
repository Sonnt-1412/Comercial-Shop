import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ArrowUpRight } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { formatPrice, getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProduct(slug)?.name ?? "Sản phẩm" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
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
          <ProductArt
            art={product.art}
            accent={product.accent}
            label={`PRODUCT / ${product.category.toUpperCase()}`}
          />
          <div className="detail-thumb-row" aria-hidden="true">
            <div className="detail-thumb active">
              <ProductArt
                art={product.art}
                accent={product.accent}
                compact
                label="01"
              />
            </div>
            <div className="detail-thumb">
              <ProductArt
                art={product.art === "board" ? "module" : "tools"}
                accent={product.accent}
                compact
                label="02"
              />
            </div>
            <div className="detail-thumb">
              <ProductArt
                art="display"
                accent={product.accent}
                compact
                label="03"
              />
            </div>
          </div>
        </div>
        <div className="product-detail-copy">
          <div className="detail-topline">
            <span className="eyebrow">
              <span className="eyebrow-line" /> {product.categoryLabel}
            </span>
            <span className="stock-status">
              <span className="availability-dot" /> {product.status}
            </span>
          </div>
          <h1>{product.name}</h1>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-actions">
            <AddToCartButton slug={product.slug} />
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
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" /> Có thể bạn sẽ cần
              </p>
              <h2>
                Cùng một <em>hệ.</em>
              </h2>
            </div>
            <Link className="text-link" href={`/category/${product.category}`}>
              Xem thêm <ArrowUpRight />
            </Link>
          </div>
          <div className="product-grid related-grid">
            {related.map((item, index) => (
              <ProductCard index={index} key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
