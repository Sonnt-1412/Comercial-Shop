import Link from "next/link";
import { categories } from "@/lib/products";

export function CategoryTabs({ active = "all" }: { active?: string }) {
  return <nav className="category-tabs" aria-label="Danh mục sản phẩm">{categories.map((category) => <Link className={active === category.slug ? "active" : ""} href={category.slug === "all" ? "/shop" : `/category/${category.slug}`} key={category.slug}>{category.label}</Link>)}</nav>;
}
