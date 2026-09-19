import Link from "next/link";
import { adminContext } from "@/lib/admin";
import { adminPage, searchText } from "@/lib/admin-forms";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatuses } from "@/lib/orders";
import { AdminPagination } from "@/components/admin-pagination";
import { isUuid } from "@/lib/admin-permissions";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
    customer?: string;
  }>;
}) {
  const params = await searchParams;
  const page = adminPage(params.page);
  const q = searchText(params.q);
  const status = Object.hasOwn(orderStatuses, params.status ?? "")
    ? params.status!
    : "";
  const customer = isUuid(params.customer ?? "") ? params.customer! : "";
  const { supabase } = await adminContext();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, user_id, recipient_name, phone, total, status, created_at",
      { count: "exact" },
    );
  if (status) query = query.eq("status", status);
  if (q)
    query = query.or(
      `order_number.ilike.%${q}%,recipient_name.ilike.%${q}%,phone.ilike.%${q}%`,
    );
  if (customer) query = query.eq("user_id", customer);
  const {
    data: orders,
    error,
    count,
  } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range((page - 1) * 50, page * 50 - 1);
  if (error) throw new Error("Không tải được đơn hàng.");
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Đơn hàng</h2>
        <span>{count ?? 0} đơn</span>
      </div>
      <form className="admin-filters" action="/admin/orders">
        {customer ? (
          <input type="hidden" name="customer" value={customer} />
        ) : null}
        <label>
          Tìm đơn hàng
          <input
            name="q"
            defaultValue={q}
            placeholder="Mã đơn, người nhận, điện thoại"
            maxLength={100}
          />
        </label>
        <label>
          Trạng thái
          <select name="status" defaultValue={status}>
            <option value="">Tất cả</option>
            {Object.entries(orderStatuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button className="button button-secondary" type="submit">
          Lọc
        </button>
        <Link className="text-link" href="/admin/orders">
          Bỏ lọc
        </Link>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Người nhận</th>
              <th>Ngày đặt</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.order_number}</strong>
                </td>
                <td>
                  {order.recipient_name}
                  <small>{order.phone}</small>
                </td>
                <td>{formatOrderDate(order.created_at)}</td>
                <td>{formatPrice(Number(order.total))}</td>
                <td>
                  <span className={`status status-${order.status}`}>
                    {orderStatuses[order.status] ?? order.status}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/orders/${order.id}`}>Xem →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!orders?.length ? (
        <p className="admin-empty">Không có đơn hàng phù hợp.</p>
      ) : null}
      <AdminPagination
        path="/admin/orders"
        page={page}
        count={count ?? 0}
        filters={{ q, status, customer }}
      />
    </section>
  );
}
