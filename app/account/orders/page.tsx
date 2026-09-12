import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatOrderDate, orderStatuses } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Đơn hàng" };

export default async function OrdersPage() {
  await requireUser("/account/orders");
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, created_at, total, status")
    .order("created_at", { ascending: false });
  const orders = data ?? [];
  return (
    <section>
      <div className="account-section-heading">
        <div>
          <span>03 / Orders</span>
          <h2>Lịch sử đơn hàng</h2>
        </div>
      </div>
      {orders.length ? (
        <div className="orders-list">
          {orders.map((order) => (
            <Link href={`/account/orders/${order.id}`} key={order.id}>
              <span>
                <small>Mã đơn</small>
                <strong>{order.order_number}</strong>
              </span>
              <span>
                <small>Ngày đặt</small>
                {formatOrderDate(order.created_at)}
              </span>
              <span>
                <small>Tổng hàng</small>
                {formatPrice(order.total)}
              </span>
              <span className={`status status-${order.status}`}>
                {orderStatuses[order.status] ?? order.status}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="commerce-empty compact-empty">
          <h3>Chưa có đơn hàng.</h3>
          <Link className="button button-primary" href="/shop">
            Bắt đầu mua sắm
          </Link>
        </div>
      )}
    </section>
  );
}
