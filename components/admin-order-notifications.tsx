"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Inbox = {
  count: number;
  orders: {
    id: number;
    order_number: string;
    recipient_name: string;
    created_at: string;
  }[];
  latest: { id: number; order_number: string } | null;
};

export function AdminOrderNotifications() {
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<Inbox["latest"]>(null);
  const [retry, setRetry] = useState(0);
  const lastId = useRef<number | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    let active = true;
    let running = false;
    const controller = new AbortController();
    async function refresh() {
      if (running || document.visibilityState === "hidden") return;
      running = true;
      try {
        const response = await fetch("/api/admin/order-notifications", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error(
            response.status === 401
              ? "Phiên đăng nhập đã hết hạn."
              : "Chưa cập nhật được thông báo.",
          );
        const next: Inbox = await response.json();
        if (!active) return;
        const id = next.latest?.id ?? 0;
        if (lastId.current !== null && id > lastId.current)
          setNotice(next.latest);
        lastId.current = id;
        setInbox(next);
        setError("");
      } catch (error) {
        if (active)
          setError(
            error instanceof Error
              ? error.message
              : "Chưa cập nhật được thông báo.",
          );
      } finally {
        running = false;
      }
    }
    void refresh();
    const interval = setInterval(() => void refresh(), 30000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      controller.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [pathname, retry]);
  return (
    <div className="admin-notifications">
      <details>
        <summary>
          Đơn chờ xác nhận{" "}
          <strong aria-live="polite">{inbox?.count ?? "…"}</strong>
        </summary>
        <div className="admin-inbox">
          <h3>Đơn hàng cần xử lý</h3>
          <p className="admin-help">
            Tự cập nhật mỗi 30 giây khi bạn mở trang quản trị.
          </p>
          {error ? (
            <p className="form-error" role="status">
              {error}
            </p>
          ) : null}
          {inbox?.orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}>
              <strong>{order.order_number}</strong>
              <span>{order.recipient_name}</span>
            </Link>
          ))}
          {inbox?.count === 0 ? <p>Không có đơn chờ xác nhận.</p> : null}
          <div className="admin-actions">
            <Link className="text-link" href="/admin/orders?status=pending">
              Xem tất cả
            </Link>
            <button
              className="text-link"
              type="button"
              onClick={() => setRetry((value) => value + 1)}
            >
              Làm mới
            </button>
          </div>
        </div>
      </details>
      {error ? (
        <span className="admin-help" role="status">
          Thông báo tạm gián đoạn
        </span>
      ) : null}
      {notice ? (
        <div className="admin-new-order" role="status">
          <Link href={`/admin/orders/${notice.id}`}>
            Có đơn mới: {notice.order_number} →
          </Link>
          <button
            type="button"
            aria-label="Đóng thông báo"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
