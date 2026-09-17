import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Đặt hàng thành công" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await requireUser("/account/orders");
  const id = Number((await searchParams).id);
  if (!Number.isSafeInteger(id)) notFound();
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, total")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();
  return (
    <main className="success-page shell" id="main-content">
      <section>
        <span className="success-mark">✓</span>
        <h1>
          Đặt hàng
          <br />
          <em>thành công.</em>
        </h1>
        <div className="success-meta">
          <span>
            Mã đơn<strong>{order.order_number}</strong>
          </span>
          <span>
            Tổng hàng<strong>{formatPrice(order.total)}</strong>
          </span>
        </div>
        <p>
          Đơn hàng của bạn đã được ghi nhận. Shop sẽ liên hệ để xác nhận và báo
          phí giao hàng.
        </p>
        <div className="success-actions">
          <Link
            className="button button-primary"
            href={`/account/orders/${order.id}`}
          >
            Xem đơn hàng
          </Link>
          <Link className="button button-secondary" href="/shop">
            Tiếp tục mua sắm
          </Link>
        </div>
      </section>
    </main>
  );
}
