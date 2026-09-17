import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductCard } from "@/components/product-card";
import { getCatalogCategories, getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Sản phẩm" };

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getCatalogProducts(), getCatalogCategories()]);
  return (
    <main className="page-shell shell" id="main-content">
      <div className="page-intro">
        <h1>Sản phẩm</h1>
      </div>
      <CategoryTabs categories={categories} />
      <div className="results-bar">
        <span>{products.length} sản phẩm</span>
      </div>
      <div className="product-grid shop-grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
