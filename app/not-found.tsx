import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found shell" id="main-content">
      <p className="eyebrow">
        <span className="eyebrow-line" /> 404 / Không tìm thấy
      </p>
      <h1>
        Thứ này chưa
        <br />
        <em>nằm trên kệ.</em>
      </h1>
      <Link className="button button-primary" href="/shop">
        Quay lại shop
      </Link>
    </main>
  );
}
