import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductCard } from "@/components/product-card";
import { SearchForm } from "@/components/search-form";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "Tìm kiếm" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
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
        <div>
          <p className="eyebrow">
            <span className="eyebrow-line" /> Search / Find your part
          </p>
          <h1>
            Tìm một thứ
            <br />
            <em>để bắt đầu.</em>
          </h1>
        </div>
      </div>
      <SearchForm initialValue={query} />
      <CategoryTabs />
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
              {results.map((product, index) => (
                <ProductCard
                  index={index}
                  key={product.slug}
                  product={product}
                />
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
