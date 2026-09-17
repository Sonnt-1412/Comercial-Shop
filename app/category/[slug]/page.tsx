import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductCard } from "@/components/product-card";
import { getCatalogCategories, getCatalogProducts } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCatalogCategories()).find((item) => item.slug === slug);
  return { title: category ? category.label : "Danh mục" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCatalogCategories(), getCatalogProducts()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category || category.slug === "all") notFound();
  const filtered = products.filter((product) => product.category === slug);
  return (
    <main className="page-shell shell" id="main-content">
      <div className="page-intro">
        <h1>{category.label}</h1>
      </div>
      <CategoryTabs active={slug} categories={categories} />
      <div className="results-bar">
        <span>{filtered.length} sản phẩm trong mục này</span>
      </div>
      {filtered.length > 0 ? (
        <div className="product-grid shop-grid">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">Chưa có sản phẩm trong danh mục này.</div>
      )}
    </main>
  );
}
