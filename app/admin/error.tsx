"use client";

import Link from "next/link";
import { useTransition } from "react";

export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <section className="admin-panel" role="alert">
      <h2>Chưa tải được dữ liệu</h2>
      <p>
        Không lấy được dữ liệu quản trị từ máy chủ. Hãy thử tải lại; nếu vẫn
        lỗi, kiểm tra Runtime Logs của deployment trên Vercel để xem nguyên
        nhân.
      </p>
      {error.digest ? (
        <p>
          Mã tra cứu lỗi: <code>{error.digest}</code>
        </p>
      ) : null}
      <div className="admin-actions">
        <button
          className="button button-primary"
          disabled={pending}
          onClick={() => startTransition(retry)}
        >
          {pending ? "Đang tải lại…" : "Thử lại"}
        </button>
        <Link className="text-link" href="/admin">
          Về tổng quan
        </Link>
      </div>
    </section>
  );
}
