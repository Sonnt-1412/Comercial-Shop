"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/admin", "Tổng quan"],
  ["/admin/products", "Sản phẩm"],
  ["/admin/categories", "Danh mục"],
  ["/admin/orders", "Đơn hàng"],
  ["/admin/customers", "Khách hàng"],
];
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Quản trị">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={
            (
              href === "/admin"
                ? pathname === href
                : pathname.startsWith(href + "/") || pathname === href
            )
              ? "page"
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
