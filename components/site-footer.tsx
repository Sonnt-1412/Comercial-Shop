import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="shell footer-main">
      <div>
        <Link className="footer-brand" href="/">NØR<span>/SHOP</span></Link>
        <p className="footer-note">Một shop nhỏ cho những người thích<br />xây dựng mọi thứ từ đầu.</p>
      </div>
      <div className="footer-column"><span className="footer-label">Đi đến</span><Link href="/shop">Sản phẩm</Link><Link href="/#about">Giới thiệu</Link><Link href="/search">Tìm kiếm</Link></div>
      <div className="footer-column"><span className="footer-label">Liên hệ</span><a href="mailto:hello@nor.shop">hello@nor.shop</a><span>TP. Hồ Chí Minh</span></div>
      <div className="footer-stamp">HARDWARE<br />FOR BUILDERS<br /><span>EST. 2026</span></div>
    </div>
    <div className="shell footer-bottom"><span>© 2026 NØR/SHOP</span><span>Không thanh toán online · Chỉ nhận đơn thủ công</span></div>
  </footer>;
}
