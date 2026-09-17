import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <Link className="footer-brand" href="/">
          Xuanquy
        </Link>
        <nav className="footer-column" aria-label="Liên kết cuối trang">
          <Link href="/shop">Sản phẩm</Link>
          <Link href="/cart">Giỏ hàng</Link>
          <Link href="/account">Tài khoản</Link>
          <Link href="/search">Tìm kiếm</Link>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>Không thanh toán online</span>
      </div>
    </footer>
  );
}
