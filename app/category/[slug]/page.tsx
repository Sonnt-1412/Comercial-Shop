import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductCard } from "@/components/product-card";
import { categories, getCategory, products } from "@/lib/products";

export function generateStaticParams() { return categories.filter((category) => category.slug !== "all").map((category) => ({ slug: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category ? category.label : "Danh mục" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category || category.slug === "all") notFound();
  const filtered = products.filter((product) => product.category === slug);
  return <main className="page-shell shell"><div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> Category / {String(slug).toUpperCase()}</p><h1>{category.label}</h1></div><p className="page-intro-note">Một nhóm nhỏ, một hướng<br />để bắt đầu.</p></div><CategoryTabs active={slug} /><div className="results-bar"><span>{filtered.length} sản phẩm trong mục này</span><span>Hiển thị theo bộ sưu tập</span></div>{filtered.length > 0 ? <div className="product-grid shop-grid">{filtered.map((product, index) => <ProductCard index={index} key={product.slug} product={product} />)}</div> : <div className="empty-state">Chưa có sản phẩm trong danh mục này.</div>}</main>;
}
