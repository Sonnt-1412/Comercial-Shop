"use client";

import Link from "next/link";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <section className="admin-panel" role="alert">
      <h2>Chưa tải được dữ liệu</h2>
      <p>
        Kết nối hoặc cấu hình quản trị đang gặp sự cố. Bạn có thể thử tải lại
        trang.
      </p>
      <div className="admin-actions">
        <button className="button button-primary" onClick={reset}>
          Thử lại
        </button>
        <Link className="text-link" href="/admin">
          Về tổng quan
        </Link>
      </div>
    </section>
  );
}
