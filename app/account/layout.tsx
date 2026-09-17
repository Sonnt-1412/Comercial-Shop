import Link from "next/link";
import type { ReactNode } from "react";

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="account-page shell" id="main-content">
      <div className="account-heading">
        <h1>Tài khoản</h1>
      </div>
      <div className="account-layout">
        <nav className="account-nav" aria-label="Tài khoản">
          <Link href="/account">Thông tin</Link>
          <Link href="/account/addresses">Địa chỉ</Link>
          <Link href="/account/orders">Đơn hàng</Link>
          <form action="/auth/signout" method="post">
            <button type="submit">Đăng xuất</button>
          </form>
        </nav>
        <div className="account-content">{children}</div>
      </div>
    </main>
  );
}
