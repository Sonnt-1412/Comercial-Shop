import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Quản trị",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  return (
    <main className="admin-page shell" id="main-content">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Xuanquy / Quản trị</p>
          <h1>Quản lý cửa hàng</h1>
        </div>
        <Link className="text-link" href="/shop">
          Xem cửa hàng ↗
        </Link>
      </div>
      <div className="admin-layout">
        <nav className="admin-nav" aria-label="Quản trị">
          <Link href="/admin">Tổng quan</Link>
          <Link href="/admin/products">Sản phẩm</Link>
          <Link href="/admin/categories">Danh mục</Link>
          <Link href="/admin/orders">Đơn hàng</Link>
          <Link href="/admin/customers">Khách hàng</Link>
        </nav>
        <div className="admin-content">{children}</div>
      </div>
    </main>
  );
}
