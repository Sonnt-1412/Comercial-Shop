import Link from "next/link";
import { AdminForm } from "@/components/admin-form";
import { notFound } from "next/navigation";
import { adminContext } from "@/lib/admin";
import { updateOrder } from "@/app/admin/actions";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatuses } from "@/lib/orders";

export default async function AdminOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id < 1) notFound();
  const { supabase } = await adminContext();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, user_id, recipient_name, phone, address_line, ward, district, province, note, status, total, created_at, order_items(id, product_name, quantity, unit_price, line_total)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Không tải được đơn hàng.");
  if (!order) notFound();
  const { data: buyer } = await supabase.auth.admin.getUserById(order.user_id);
  const notice = (await searchParams).notice;
  return (
    <section>
      <Link className="text-link" href="/admin/orders">
        ← Đơn hàng
      </Link>
      <div className="admin-section-heading">
        <h2>{order.order_number}</h2>
        <span>{formatOrderDate(order.created_at)}</span>
      </div>
      {notice ? (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      ) : null}
      <div className="admin-two-columns">
        <div className="admin-panel">
          <h3>Sản phẩm</h3>
          <div className="review-lines">
            {(order.order_items ?? []).map((item) => (
              <div key={item.id}>
                <span>
                  <strong>{item.product_name}</strong>
                  <small>
                    {item.quantity} × {formatPrice(Number(item.unit_price))}
                  </small>
                </span>
                <b>{formatPrice(Number(item.line_total))}</b>
              </div>
            ))}
          </div>
          <div className="order-detail-total">
            <span>Tổng hàng</span>
            <strong>{formatPrice(Number(order.total))}</strong>
          </div>
        </div>
        <div className="admin-panel">
          <h3>Người mua và giao hàng</h3>
          <p>
            <Link
              className="text-link"
              href={`/admin/customers/${order.user_id}`}
            >
              {buyer.user?.email ?? order.user_id}
            </Link>
          </p>
          <p>
            {order.recipient_name}
            <br />
            <a className="text-link" href={`tel:${order.phone}`}>
              {order.phone}
            </a>
            <br />
            {order.address_line}, {order.ward}, {order.district},{" "}
            {order.province}
          </p>
          {order.note ? <p>Ghi chú: {order.note}</p> : null}
        </div>
      </div>
      <div className="admin-panel">
        <h3>Trạng thái</h3>
        <p className="admin-help">
          Hủy đơn sẽ hoàn lại tồn kho đã giữ. Mở lại đơn đã hủy cần đủ hàng.
        </p>
        <AdminForm
          className="admin-status-form"
          action={updateOrder}
          confirm="Cập nhật trạng thái đơn hàng này?"
        >
          <input type="hidden" name="id" value={id} />
          <select
            aria-label="Trạng thái đơn hàng"
            name="status"
            defaultValue={order.status}
          >
            {Object.entries(orderStatuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="button button-primary" type="submit">
            Cập nhật
          </button>
        </AdminForm>
      </div>
    </section>
  );
}
