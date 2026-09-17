import Link from "next/link";
import { adminContext } from "@/lib/admin";
import { formatPrice } from "@/lib/products";
import { ProductForm } from "@/app/admin/products/product-form";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(
    1,
    Math.min(1000, Math.trunc(Number(params.page) || 1)),
  );
  const { supabase } = await adminContext();
  const [{ data: products, error }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("slug, name, category, price, stock, is_active")
      .order("created_at", { ascending: false })
      .range((page - 1) * 50, page * 50 - 1),
    supabase.from("categories").select("slug, name").order("sort_order"),
  ]);
  if (error)
    throw new Error("Không tải được sản phẩm. Hãy áp dụng migration Phase 3.");
  const notice = params.notice;
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Sản phẩm</h2>
        <span>Trang {page}</span>
      </div>
      {notice ? (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      ) : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Hiển thị</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => (
              <tr key={product.slug}>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.slug}</small>
                </td>
                <td>{product.category}</td>
                <td>{formatPrice(Number(product.price))}</td>
                <td>{product.stock ?? "Chưa nhập"}</td>
                <td>{product.is_active ? "Đang bán" : "Đã ẩn"}</td>
                <td>
                  <Link href={`/admin/products/${product.slug}`}>
                    Chỉnh sửa →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-pagination">
        {page > 1 ? (
          <Link href={`/admin/products?page=${page - 1}`}>← Trước</Link>
        ) : null}
        {products?.length === 50 ? (
          <Link href={`/admin/products?page=${page + 1}`}>Tiếp →</Link>
        ) : null}
      </div>
      <div className="admin-panel">
        <h3>Thêm sản phẩm</h3>
        <ProductForm categories={categories ?? []} />
      </div>
    </section>
  );
}
