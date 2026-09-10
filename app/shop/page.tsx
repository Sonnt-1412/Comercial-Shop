import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "Sản phẩm" };

export default function ShopPage() {
  return <main className="page-shell shell"><div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> Catalogue / 2026</p><h1>Tất cả sản phẩm</h1></div><p className="page-intro-note">Những phần tử nhỏ cho các dự án lớn.<br />Chọn một thứ để bắt đầu.</p></div><CategoryTabs /><div className="results-bar"><span>{products.length} sản phẩm</span><span>Sắp xếp: Mới nhất <span className="sort-caret">↓</span></span></div><div className="product-grid shop-grid">{products.map((product, index) => <ProductCard index={index} key={product.slug} product={product} />)}</div></main>;
}
