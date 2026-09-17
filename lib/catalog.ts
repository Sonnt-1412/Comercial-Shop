import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  categories as sampleCategories,
  products as sampleProducts,
  type Product,
  type ProductArt,
} from "@/lib/products";

export type CatalogCategory = {
  slug: string;
  label: string;
  sort_order: number;
};

const sampleTabs: CatalogCategory[] = sampleCategories
  .filter((category) => category.slug !== "all")
  .map((category, index) => ({ ...category, sort_order: (index + 1) * 10 }));

export const getCatalogCategories = cache(
  async function getCatalogCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug, name, sort_order")
      .order("sort_order")
      .order("name");
    if (error) {
      if (error.code === "42P01" || error.code === "PGRST205")
        return sampleTabs;
      throw new Error("Không tải được danh mục sản phẩm.");
    }
    return (data ?? []).map((category) => ({
      slug: category.slug as string,
      label: category.name as string,
      sort_order: category.sort_order as number,
    }));
  },
);

export const getCatalogProducts = cache(async function getCatalogProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "slug, name, short_name, category, price, description, stock, art, accent, specs, images, is_active",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    if (error.code === "42703" || error.code === "PGRST204")
      return sampleProducts;
    throw new Error("Không tải được sản phẩm.");
  }
  const categories = await getCatalogCategories();
  return (data ?? []).map((row): Product => {
    const sample = sampleProducts.find((item) => item.slug === row.slug);
    const stock = row.stock === null ? null : Number(row.stock ?? 0);
    const specs = Array.isArray(row.specs) ? row.specs : [];
    return {
      slug: String(row.slug),
      name: String(row.name),
      shortName: String(row.short_name || row.name),
      category: String(row.category),
      categoryLabel:
        categories.find((item) => item.slug === row.category)?.label ??
        String(row.category),
      price: Number(row.price),
      status:
        stock === null
          ? (sample?.status ?? "Còn hàng")
          : stock === 0
            ? "Hết hàng"
            : stock <= 5
              ? "Sắp hết"
              : "Còn hàng",
      description: String(row.description ?? ""),
      art: row.art as ProductArt,
      accent: String(row.accent),
      specs: specs as Product["specs"],
      images: Array.isArray(row.images) ? row.images : [],
      stock,
      isActive: true,
    };
  });
});
