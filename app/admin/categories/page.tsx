import { adminContext } from "@/lib/admin";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { supabase } = await adminContext();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("slug, name, sort_order")
    .order("sort_order")
    .order("name");
  if (error)
    throw new Error("Không tải được danh mục. Hãy áp dụng migration Phase 3.");
  const notice = (await searchParams).notice;
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Danh mục</h2>
        <span>{categories?.length ?? 0} danh mục</span>
      </div>
      {notice ? (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      ) : null}
      <div className="admin-category-list">
        {(categories ?? []).map((category) => (
          <div className="admin-panel" key={category.slug}>
            <form className="admin-category-form" action={saveCategory}>
              <input type="hidden" name="originalSlug" value={category.slug} />
              <label>
                Mã
                <input
                  name="slug"
                  defaultValue={category.slug}
                  required
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
                  defaultValue={category.sort_order}
                  required
                />
              </label>
              <button className="button button-secondary" type="submit">
                Lưu
              </button>
            </form>
            <form action={deleteCategory}>
              <input type="hidden" name="slug" value={category.slug} />
              <ConfirmSubmitButton
                className="danger-link"
                message={`Xóa danh mục ${category.name}?`}
              >
                Xóa
              </ConfirmSubmitButton>
            </form>
          </div>
        ))}
      </div>
      <div className="admin-panel">
        <h3>Thêm danh mục</h3>
        <form className="admin-category-form" action={saveCategory}>
          <label>
            Mã
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder="linh-kien"
            />
          </label>
          <label>
            Tên
            <input name="name" required maxLength={80} />
          </label>
          <label>
            Thứ tự
            <input name="sortOrder" type="number" defaultValue={60} required />
          </label>
          <button className="button button-primary" type="submit">
            Thêm
          </button>
        </form>
      </div>
    </section>
  );
}
