import Link from "next/link";
import { ArrowRight, ArrowUpRight, BoxIcon } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export default function HomePage() {
  return <main>
    <section className="hero shell">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line" /> Hardware / Components / Electronics</p>
        <h1>Dụng cụ tốt cho những điều <em>còn đang thành hình.</em></h1>
        <p className="hero-description">Một tuyển chọn phần cứng, linh kiện và phụ kiện cho những người thích hiểu mọi thứ hoạt động như thế nào.</p>
        <Link className="button button-primary" href="/shop">Xem sản phẩm <ArrowRight /></Link>
        <div className="hero-meta"><span>01 — 06</span><span>Small parts.<br />Big ideas.</span></div>
      </div>
      <div className="hero-visual"><ProductArt art="board" accent="#c8a96b" label="FEATURED / 01" /><span className="hero-side-label">NØR/SHOP <i>OBJECT 01</i></span><span className="hero-coordinate">10°46&apos;N<br />106°40&apos;E</span></div>
    </section>

    <section className="ticker"><div className="ticker-track"><span>BOARD</span><i>✳</i><span>SENSOR</span><i>✳</i><span>MODULE</span><i>✳</i><span>TOOLS</span><i>✳</i><span>BOARD</span><i>✳</i><span>SENSOR</span></div></section>

    <section className="shell section-block">
      <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> 01 / Tuyển chọn</p><h2>Những món đáng<br /><em>bắt đầu từ đây.</em></h2></div><Link className="text-link" href="/shop">Xem toàn bộ <ArrowUpRight /></Link></div>
      <div className="product-grid featured-grid">{products.slice(0, 4).map((product, index) => <ProductCard index={index} key={product.slug} product={product} />)}</div>
    </section>

    <section className="shell category-banner"><div className="category-banner-copy"><p className="eyebrow"><span className="eyebrow-line" /> Duyệt theo mục đích</p><h2>Từ tín hiệu đầu tiên<br />đến <em>vật thể hoàn thiện.</em></h2><Link className="button button-secondary" href="/category/board">Khám phá các board <ArrowUpRight /></Link></div><div className="category-list"><Link href="/category/board"><span>01</span><strong>Boards</strong><ArrowRight /></Link><Link href="/category/sensor"><span>02</span><strong>Cảm biến</strong><ArrowRight /></Link><Link href="/category/module"><span>03</span><strong>Modules</strong><ArrowRight /></Link><Link href="/category/accessories"><span>04</span><strong>Phụ kiện</strong><ArrowRight /></Link></div></section>

    <section className="shell about-section" id="about"><div className="about-number">02</div><div className="about-copy"><p className="eyebrow"><span className="eyebrow-line" /> Về NØR/SHOP</p><h2>Không phải một<br /><em>template ecommerce.</em></h2><p>Chúng tôi chọn những món đồ có thể nằm trên bàn làm việc của bạn hôm nay và trở thành một thứ hoàn toàn khác vào ngày mai.</p><Link className="text-link" href="/shop">Đi vào shop <ArrowUpRight /></Link></div><div className="about-note"><BoxIcon /><span>Đóng gói thủ công<br />từ TP. Hồ Chí Minh</span></div></section>
  </main>;
}
