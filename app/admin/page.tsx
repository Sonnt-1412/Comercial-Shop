import Link from "next/link";
import { adminContext, adminReadError } from "@/lib/admin";
import { formatOrderDate, orderStatuses } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export default async function AdminPage() {
  const { supabase } = await adminContext();
  const [products, orders, customers, pending, lowStock, recent] =
    await Promise.all([
      supabase.from("products").select("slug", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("user_id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("products")
        .select("slug,name,stock", { count: "exact" })
        .eq("is_active", true)
        .or("stock.lte.5,stock.is.null")
        .order("stock", { nullsFirst: true })
        .limit(8),
      supabase
        .from("orders")
        .select("id,order_number,recipient_name,status,total,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);
  for (const [operation, result] of Object.entries({
    products,
    orders,
    customers,
    pending,
    lowStock,
    recent,
  })) {
    if (result.error)
      adminReadError(`overview.${operation}`, {
        code: result.error.code,
        status: result.status,
      });
  }
  return (
    <section>
      <div className="admin-section-heading">
        <h2>Tổng quan</h2>
        <Link
          className="button button-primary"
          href="/admin/products#add-product"
        >
          + Thêm sản phẩm
        </Link>
      </div>
      <div className="admin-stats">
        <Link href="/admin/products">
          <strong>{products.count ?? 0}</strong>
          <span>Sản phẩm</span>
        </Link>
        <Link href="/admin/orders">
          <strong>{orders.count ?? 0}</strong>
          <span>Đơn hàng</span>
        </Link>
        <Link href="/admin/orders?status=pending">
          <strong>{pending.count ?? 0}</strong>
          <span>Chờ xác nhận</span>
        </Link>
        <Link href="/admin/customers">
          <strong>{customers.count ?? 0}</strong>
          <span>Khách hàng</span>
        </Link>
      </div>
      <div className="admin-panel">
        <div className="admin-section-heading">
          <h3>Đơn hàng gần đây</h3>
          <Link className="text-link" href="/admin/orders">
            Xem tất cả →
          </Link>
        </div>
        {recent.data?.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recent.data.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/admin/orders/${order.id}`}>
                        {order.order_number}
                      </Link>
                    </td>
                    <td>{order.recipient_name}</td>
                    <td>{formatOrderDate(order.created_at)}</td>
                    <td>{formatPrice(Number(order.total))}</td>
                    <td>
                      <span className={`status status-${order.status}`}>
                        {orderStatuses[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Chưa có đơn hàng.</p>
        )}
      </div>
      <div className="admin-panel">
        <div className="admin-section-heading">
          <h3>Tồn kho cần chú ý ({lowStock.count ?? 0})</h3>
          <Link
            className="text-link"
            href="/admin/products?stock=low&visibility=active"
          >
            Xem hàng sắp hết →
          </Link>
        </div>
        <p className="admin-help">
          Sản phẩm đang bán còn tối đa 5 đơn vị hoặc chưa nhập tồn kho.
        </p>
        <div className="admin-stock-list">
          {lowStock.data?.map((product) => (
            <Link key={product.slug} href={`/admin/products/${product.slug}`}>
              <span>{product.name}</span>
              <strong>
                {product.stock === null
                  ? "Chưa nhập"
                  : product.stock === 0
                    ? "Hết hàng"
                    : `Còn ${product.stock}`}
              </strong>
            </Link>
          ))}
        </div>
        {!lowStock.data?.length ? <p>Tồn kho đang ổn.</p> : null}
      </div>
    </section>
  );
}
