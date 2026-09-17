import Link from "next/link";
import { adminContext } from "@/lib/admin";
import { formatOrderDate } from "@/lib/orders";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Math.max(
    1,
    Math.min(1000, Math.trunc(Number((await searchParams).page) || 1)),
  );
  const { supabase } = await adminContext();
  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: 50,
  });
  if (error) throw new Error("Không tải được khách hàng.");
  const ids = data.users.map((user) => user.id);
  const { data: profiles } = ids.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name, phone")
        .in("user_id", ids)
    : { data: [] };
  const profileById = new Map(
    (profiles ?? []).map((profile) => [profile.user_id, profile]),
  );
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Khách hàng</h2>
        <span>Trang {page}</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => {
              const profile = profileById.get(user.id);
              return (
                <tr key={user.id}>
                  <td>
                    <strong>{profile?.full_name || "Chưa có tên"}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{profile?.phone ?? "—"}</td>
                  <td>{formatOrderDate(user.created_at)}</td>
                  <td>
                    <Link href={`/admin/customers/${user.id}`}>
                      Chỉnh sửa →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="admin-pagination">
        {page > 1 ? (
          <Link href={`/admin/customers?page=${page - 1}`}>← Trước</Link>
        ) : null}
        {data.users.length === 50 ? (
          <Link href={`/admin/customers?page=${page + 1}`}>Tiếp →</Link>
        ) : null}
      </div>
    </section>
  );
}
