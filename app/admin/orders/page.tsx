import Link from "next/link";
import { adminContext } from "@/lib/admin";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatuses } from "@/lib/orders";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Math.max(
    1,
    Math.min(1000, Math.trunc(Number((await searchParams).page) || 1)),
  );
  const { supabase } = await adminContext();
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, user_id, recipient_name, total, status, created_at",
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * 50, page * 50 - 1);
  if (error) throw new Error("Không tải được đơn hàng.");
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Đơn hàng</h2>
        <span>Trang {page}</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Người nhận</th>
              <th>Ngày đặt</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.order_number}</strong>
                </td>
                <td>{order.recipient_name}</td>
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
        <p className="admin-empty">Chưa có đơn hàng.</p>
      ) : null}
      <div className="admin-pagination">
        {page > 1 ? (
          <Link href={`/admin/orders?page=${page - 1}`}>← Trước</Link>
        ) : null}
        {orders?.length === 50 ? (
          <Link href={`/admin/orders?page=${page + 1}`}>Tiếp →</Link>
        ) : null}
      </div>
    </section>
  );
}
