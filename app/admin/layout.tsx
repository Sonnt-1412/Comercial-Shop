import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin-nav";
import { AdminOrderNotifications } from "@/components/admin-order-notifications";

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
        <div className="admin-heading-actions">
          <AdminOrderNotifications />
          <Link className="text-link" href="/account">
            Tài khoản
          </Link>
          <Link className="text-link" href="/shop">
            Xem cửa hàng ↗
          </Link>
        </div>
      </div>
      <div className="admin-layout">
        <AdminNav />
        <div className="admin-content">{children}</div>
      </div>
    </main>
  );
}
