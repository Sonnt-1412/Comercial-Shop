import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductCard } from "@/components/product-card";
import { SearchForm } from "@/components/search-form";
import { getCatalogCategories, getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Tìm kiếm" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getCatalogProducts(), getCatalogCategories()]);
  const query = params.q?.trim() ?? "";
  const normalized = query.toLowerCase();
  const results = normalized
    ? products.filter((product) =>
        [
          product.name,
          product.categoryLabel,
          product.description,
          product.category,
        ].some((value) => value.toLowerCase().includes(normalized)),
      )
    : [];
  return (
    <main className="page-shell shell search-page" id="main-content">
      <div className="page-intro">
        <h1>Tìm kiếm sản phẩm</h1>
      </div>
      <SearchForm initialValue={query} />
      <CategoryTabs categories={categories} />
      {query ? (
        <>
          <div className="results-bar">
            <span>
              {results.length} kết quả cho “{query}”
            </span>
            <span>Tên · từ khóa · danh mục</span>
          </div>
          {results.length > 0 ? (
            <div className="product-grid shop-grid">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              Không tìm thấy sản phẩm phù hợp. Thử “board”, “module” hoặc
              “sensor”.
            </div>
          )}
        </>
      ) : (
        <div className="search-hint">
          <span>Gợi ý tìm kiếm</span>
          <div>
            <span>ESP32</span>
            <span>cảm biến</span>
            <span>phụ kiện</span>
            <span>OLED</span>
          </div>
        </div>
      )}
    </main>
  );
}
