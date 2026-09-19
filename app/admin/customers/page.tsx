import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { adminContext, adminReadError } from "@/lib/admin";
import { adminPage, searchText } from "@/lib/admin-forms";
import { formatOrderDate } from "@/lib/orders";
import { AdminPagination } from "@/components/admin-pagination";
import { adminConfiguration } from "@/lib/admin-config";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = adminPage(params.page);
  const q = searchText(params.q);
  const { supabase } = await adminContext();
  // Auth supports server-side email filtering; the JS SDK does not expose it.
  const config = adminConfiguration(process.env);
  const url = new URL("/auth/v1/admin/users", config.url);
  url.search = new URLSearchParams({
    page: String(page),
    per_page: "50",
    filter: q,
  }).toString();
  const key = config.key;
  const response = await fetch(url, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok)
    adminReadError("customers.auth", { status: response.status });
  const data: { users: User[] } = await response.json();
  const total = Number(
    response.headers.get("x-total-count") ?? data.users.length,
  );
  const ids = data.users.map((user) => user.id);
  const { data: profiles, error } = ids.length
    ? await supabase
        .from("profiles")
        .select("user_id,full_name,phone")
        .in("user_id", ids)
    : { data: [], error: null };
  if (error) adminReadError("customers.profiles", error);
  const profileById = new Map(
    (profiles ?? []).map((profile) => [profile.user_id, profile]),
  );
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Khách hàng</h2>
        <span>{total} tài khoản</span>
      </div>
      <form className="admin-filters" action="/admin/customers">
        <label>
          Tìm theo email
          <input
            name="q"
            defaultValue={q}
            placeholder="Email khách hàng"
            maxLength={100}
          />
        </label>
        <button className="button button-secondary" type="submit">
          Tìm khách hàng
        </button>
        <Link className="text-link" href="/admin/customers">
          Bỏ lọc
        </Link>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
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
                  <td>
                    {user.email}
                    <small>
                      {user.email_confirmed_at
                        ? "Đã xác nhận email"
                        : "Chưa xác nhận email"}
                    </small>
                  </td>
                  <td>{profile?.phone ?? "—"}</td>
                  <td>{formatOrderDate(user.created_at)}</td>
                  <td>
                    <Link href={`/admin/customers/${user.id}`}>
                      Xem / chỉnh sửa →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!data.users.length ? (
        <p className="admin-empty">Không có khách hàng phù hợp.</p>
      ) : null}
      <AdminPagination
        path="/admin/customers"
        page={page}
        count={total}
        filters={{ q }}
      />
    </section>
  );
}
