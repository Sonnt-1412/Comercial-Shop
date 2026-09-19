import Link from "next/link";
import { adminContext } from "@/lib/admin";
import { adminPage, searchText } from "@/lib/admin-forms";
import { formatPrice } from "@/lib/products";
import { ProductForm } from "@/app/admin/products/product-form";
import { setProductVisibility } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin-form";
import { AdminPagination } from "@/components/admin-pagination";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    notice?: string;
    page?: string;
    q?: string;
    category?: string;
    stock?: string;
    visibility?: string;
  }>;
}) {
  const params = await searchParams;
  const page = adminPage(params.page);
  const q = searchText(params.q);
  const category = params.category ?? "";
  const stock = params.stock ?? "";
  const visibility = params.visibility ?? "";
  const { supabase } = await adminContext();
  let query = supabase
    .from("products")
    .select("slug, name, category, price, stock, is_active", {
      count: "exact",
    });
  if (q) query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
  if (category) query = query.eq("category", category);
  if (stock === "low") query = query.lte("stock", 5);
  if (stock === "empty") query = query.eq("stock", 0);
  if (stock === "unknown") query = query.is("stock", null);
  if (visibility === "active" || visibility === "hidden")
    query = query.eq("is_active", visibility === "active");
  const [
    { data: products, error, count },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    query
      .order("created_at", { ascending: false })
      .order("slug")
      .range((page - 1) * 50, page * 50 - 1),
    supabase.from("categories").select("slug, name").order("sort_order"),
  ]);
  if (error || categoriesError) throw new Error("Không tải được sản phẩm.");
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Sản phẩm</h2>
        <Link className="button button-primary" href="#add-product">
          + Thêm sản phẩm
        </Link>
      </div>
      {params.notice ? (
        <p className="admin-notice" role="status">
          {params.notice}
        </p>
      ) : null}
      <form className="admin-filters" action="/admin/products">
        <label>
          Tìm sản phẩm
          <input
            name="q"
            defaultValue={q}
            placeholder="Tên hoặc mã sản phẩm"
            maxLength={100}
          />
        </label>
        <label>
          Danh mục
          <select name="category" defaultValue={category}>
            <option value="">Tất cả</option>
            {categories?.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tồn kho
          <select name="stock" defaultValue={stock}>
            <option value="">Tất cả</option>
            <option value="low">Sắp hết (≤ 5)</option>
            <option value="empty">Hết hàng</option>
            <option value="unknown">Chưa nhập</option>
          </select>
        </label>
        <label>
          Hiển thị
          <select name="visibility" defaultValue={visibility}>
            <option value="">Tất cả</option>
            <option value="active">Đang bán</option>
            <option value="hidden">Đã ẩn</option>
          </select>
        </label>
        <button className="button button-secondary" type="submit">
          Lọc
        </button>
        <Link className="text-link" href="/admin/products">
          Bỏ lọc
        </Link>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Hiển thị</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.slug}>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.slug}</small>
                </td>
                <td>
                  {categories?.find((item) => item.slug === product.category)
                    ?.name ?? product.category}
                </td>
                <td>{formatPrice(Number(product.price))}</td>
                <td
                  className={
                    product.stock !== null && product.stock <= 5
                      ? "admin-stock-low"
                      : undefined
                  }
                >
                  {product.stock ?? "Chưa nhập"}
                </td>
                <td>{product.is_active ? "Đang bán" : "Đã ẩn"}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/products/${product.slug}`}>
                      Chỉnh sửa →
                    </Link>
                    <AdminForm action={setProductVisibility}>
                      <input type="hidden" name="slug" value={product.slug} />
                      <input
                        type="hidden"
                        name="active"
                        value={String(!product.is_active)}
                      />
                      <button className="text-link" type="submit">
                        {product.is_active ? "Ẩn" : "Hiện"}
                      </button>
                    </AdminForm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!products?.length ? (
        <p className="admin-empty">
          Không có sản phẩm phù hợp. Thử bỏ bộ lọc hoặc thêm sản phẩm mới.
        </p>
      ) : null}
      <AdminPagination
        path="/admin/products"
        page={page}
        count={count ?? 0}
        filters={{ q, category, stock, visibility }}
      />
      <div className="admin-panel" id="add-product">
        <h3>Thêm sản phẩm</h3>
        <ProductForm categories={categories ?? []} />
      </div>
    </section>
  );
}
