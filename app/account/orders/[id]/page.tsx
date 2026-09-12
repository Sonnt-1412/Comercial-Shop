import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { formatOrderDate, orderStatuses } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser("/account/orders");
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id)) notFound();
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, created_at, total, status, recipient_name, phone, address_line, ward, district, province, note, order_items(product_slug, product_name, unit_price, quantity, line_total)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();
  const items = Array.isArray(order.order_items) ? order.order_items : [];
  return (
    <section>
      <Link className="text-link order-back" href="/account/orders">
        ← Tất cả đơn hàng
      </Link>
      <div className="order-detail-heading">
        <div>
          <span>Mã đơn</span>
          <h2>{order.order_number}</h2>
          <small>{formatOrderDate(order.created_at)}</small>
        </div>
        <strong className={`status status-${order.status}`}>
          {orderStatuses[order.status] ?? order.status}
        </strong>
      </div>
      <div className="order-detail-grid">
        <div>
          <h3>Sản phẩm</h3>
          <div className="review-lines">
            {items.map((item) => (
              <div key={item.product_slug}>
                <span>
                  <strong>{item.product_name}</strong>
                  <small>
                    {item.quantity} × {formatPrice(item.unit_price)}
                  </small>
                </span>
                <b>{formatPrice(item.line_total)}</b>
              </div>
            ))}
          </div>
          <div className="order-detail-total">
            <span>Tổng hàng</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>
        <aside>
          <h3>Giao đến</h3>
          <strong>{order.recipient_name}</strong>
          <p>
            {order.phone}
            <br />
            {order.address_line}
            <br />
            {order.ward}, {order.district}
            <br />
            {order.province}
          </p>
          {order.note ? (
            <p>
              <small>Ghi chú</small>
              <br />
              {order.note}
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
