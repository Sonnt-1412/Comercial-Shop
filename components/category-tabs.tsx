import Link from "next/link";
import { categories as sampleCategories } from "@/lib/products";
import type { CatalogCategory } from "@/lib/catalog";

export function CategoryTabs({
  active = "all",
  categories = sampleCategories
    .filter((item) => item.slug !== "all")
    .map((item, index) => ({ ...item, sort_order: index })),
}: {
  active?: string;
  categories?: CatalogCategory[];
}) {
  return (
    <nav className="category-tabs" aria-label="Danh mục sản phẩm">
      {[{ slug: "all", label: "Tất cả", sort_order: -1 }, ...categories].map(
        (category) => (
          <Link
            className={active === category.slug ? "active" : ""}
            href={
              category.slug === "all" ? "/shop" : `/category/${category.slug}`
            }
            key={category.slug}
          >
            {category.label}
          </Link>
        ),
      )}
    </nav>
  );
}
