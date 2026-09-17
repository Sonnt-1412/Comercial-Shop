import Link from "next/link";
import { notFound } from "next/navigation";
import { adminContext } from "@/lib/admin";
import { ProductForm } from "@/app/admin/products/product-form";

export default async function AdminProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { slug } = await params;
  const { supabase } = await adminContext();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("categories").select("slug, name").order("sort_order"),
  ]);
  if (!product) notFound();
  const notice = (await searchParams).notice;
  return (
    <section>
      <Link className="text-link" href="/admin/products">
        ← Sản phẩm
      </Link>
      <div className="admin-section-heading">
        <h2>{product.name}</h2>
        <span>{product.slug}</span>
      </div>
      {notice ? (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      ) : null}
      <ProductForm product={product} categories={categories ?? []} />
    </section>
  );
}
