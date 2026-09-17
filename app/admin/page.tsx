import Link from "next/link";
import { adminContext } from "@/lib/admin";

export default async function AdminPage() {
  const { supabase } = await adminContext();
  const [
    { count: products },
    { count: orders },
    { count: customers },
    { count: pending },
  ] = await Promise.all([
    supabase.from("products").select("slug", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("user_id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);
  return (
    <section>
      <h2>Tổng quan</h2>
      <div className="admin-stats">
        <Link href="/admin/products">
          <strong>{products ?? 0}</strong>
          <span>Sản phẩm</span>
        </Link>
        <Link href="/admin/orders">
          <strong>{orders ?? 0}</strong>
          <span>Đơn hàng</span>
        </Link>
        <Link href="/admin/orders">
          <strong>{pending ?? 0}</strong>
          <span>Chờ xác nhận</span>
        </Link>
        <Link href="/admin/customers">
          <strong>{customers ?? 0}</strong>
          <span>Khách hàng</span>
        </Link>
      </div>
    </section>
  );
}
