import Link from "next/link";
import { MenuIcon, SearchIcon } from "@/components/icons";

export function SiteHeader() {
  return <header className="site-header">
    <div className="shell header-inner">
      <Link className="brand" href="/" aria-label="Nør Shop trang chủ">
        <span className="brand-mark">NØR</span>
        <span className="brand-slash">/</span>
        <span className="brand-sub">SHOP<br /><i>01</i></span>
      </Link>

      <nav className="desktop-nav" aria-label="Điều hướng chính">
        <Link href="/shop">Sản phẩm</Link>
        <Link href="/#about">Giới thiệu</Link>
      </nav>

      <div className="header-actions">
        <Link className="search-link" href="/search" aria-label="Tìm kiếm sản phẩm"><SearchIcon /> <span>Tìm kiếm</span></Link>
        <span className="header-divider" />
        <Link className="availability" href="/shop"><span className="availability-dot" /> Sẵn sàng gửi hàng</Link>
      </div>
      <Link className="mobile-menu" href="/shop" aria-label="Mở cửa hàng"><MenuIcon /></Link>
    </div>
  </header>;
}
