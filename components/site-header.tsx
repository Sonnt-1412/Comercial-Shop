import Link from "next/link";
import { SearchIcon, UserIcon } from "@/components/icons";
import { CartLink } from "@/components/cart-link";

export function SiteHeader() {
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
          <Link className="account-link" href="/account">
            <UserIcon />
            <span>Tài khoản</span>
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
