import Link from "next/link";
import { BoxIcon, SearchIcon, UserIcon } from "@/components/icons";
import { CartLink } from "@/components/cart-link";
import { getCurrentUser } from "@/lib/auth";
import { isAdminId } from "@/lib/admin";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const admin = user ? isAdminId(user.id) : false;
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Xuanquy trang chủ">
          <span className="brand-mark">Xuanquy</span>
        </Link>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <Link href="/shop">Sản phẩm</Link>
        </nav>

        <div className="header-actions">
          <Link
            className="search-link"
            href="/search"
            aria-label="Tìm kiếm sản phẩm"
          >
            <SearchIcon /> <span>Tìm kiếm</span>
          </Link>
          <Link
            className="account-link"
            href={admin ? "/admin" : "/account"}
            aria-label={admin ? "Quản trị" : "Tài khoản"}
          >
            <UserIcon />
            <span>{admin ? "Quản trị" : "Tài khoản"}</span>
          </Link>
          <Link
            className="orders-link"
            href="/account/orders"
            aria-label="Đơn hàng"
          >
            <BoxIcon />
            <span>Đơn hàng</span>
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
