import Link from "next/link";

export function AdminPagination({
  path,
  page,
  count,
  filters = {},
}: {
  path: string;
  page: number;
  count: number;
  filters?: Record<string, string>;
}) {
  const pages = Math.max(1, Math.ceil(count / 50));
  const href = (next: number) =>
    `${path}?${new URLSearchParams({ ...filters, page: String(next) })}`;
  return (
    <nav className="admin-pagination" aria-label="Phân trang">
      {page > 1 ? <Link href={href(page - 1)}>← Trước</Link> : null}
      <span>
        Trang {page} / {pages} · {count} kết quả
      </span>
      {page < pages ? <Link href={href(page + 1)}>Tiếp →</Link> : null}
    </nav>
  );
}
