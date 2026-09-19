import Link from "next/link";
import { adminContext } from "@/lib/admin";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin-form";

export default async function AdminCategoriesPage() {
  const { supabase } = await adminContext();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("slug, name, sort_order, products(count)")
    .order("sort_order")
    .order("name");
  if (error) throw new Error("Không tải được danh mục.");
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Danh mục</h2>
        <span>{categories?.length ?? 0} danh mục</span>
      </div>
      <p className="admin-help">
        Thứ tự nhỏ hơn hiển thị trước. Chuyển sản phẩm sang danh mục khác trước
        khi xóa danh mục đang sử dụng.
      </p>
      <div className="admin-category-list">
        {(categories ?? []).map((category) => {
          const count = category.products?.[0]?.count ?? 0;
          return (
            <div className="admin-panel" key={category.slug}>
              <AdminForm className="admin-category-form" action={saveCategory}>
                <input
                  type="hidden"
                  name="originalSlug"
                  value={category.slug}
                />
                <label>
                  Mã
                  <input
                    name="slug"
                    defaultValue={category.slug}
                    required
                    maxLength={80}
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  />
                </label>
                <label>
                  Tên
                  <input
                    name="name"
                    defaultValue={category.name}
                    required
                    maxLength={80}
                  />
                </label>
                <label>
                  Thứ tự
                  <input
                    name="sortOrder"
                    type="number"
                    min={-2147483648}
                    max={2147483647}
                    step={1}
                    defaultValue={category.sort_order}
                    required
                  />
                </label>
                <button className="button button-secondary" type="submit">
                  Lưu danh mục
                </button>
              </AdminForm>
              <div className="admin-actions">
                <Link
                  className="text-link"
                  href={`/admin/products?category=${encodeURIComponent(category.slug)}`}
                >
                  {count} sản phẩm
                </Link>
                <AdminForm
                  action={deleteCategory}
                  confirm={`Xóa danh mục ${category.name}?`}
                >
                  <input type="hidden" name="slug" value={category.slug} />
                  <button
                    className="danger-link"
                    type="submit"
                    disabled={count > 0}
                    title={
                      count > 0
                        ? "Chuyển sản phẩm sang danh mục khác trước khi xóa"
                        : undefined
                    }
                  >
                    Xóa danh mục
                  </button>
                </AdminForm>
              </div>
            </div>
          );
        })}
      </div>
      {!categories?.length ? (
        <p className="admin-empty">
          Chưa có danh mục. Tạo danh mục đầu tiên bên dưới.
        </p>
      ) : null}
      <div className="admin-panel">
        <h3>Thêm danh mục</h3>
        <AdminForm
          className="admin-category-form"
          action={saveCategory}
          resetOnSuccess
        >
          <label>
            Mã
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              maxLength={80}
              placeholder="linh-kien"
            />
          </label>
          <label>
            Tên
            <input name="name" required maxLength={80} />
          </label>
          <label>
            Thứ tự
            <input
              name="sortOrder"
              type="number"
              min={-2147483648}
              max={2147483647}
              step={1}
              defaultValue={60}
              required
            />
          </label>
          <button className="button button-primary" type="submit">
            Thêm danh mục
          </button>
        </AdminForm>
      </div>
    </section>
  );
}
