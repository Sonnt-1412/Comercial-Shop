"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AdminResult } from "@/lib/admin-forms";

export function AdminForm({
  action,
  children,
  className,
  confirm,
  resetOnSuccess = false,
}: {
  action: (form: FormData) => Promise<AdminResult>;
  children: ReactNode;
  className?: string;
  confirm?: string;
  resetOnSuccess?: boolean;
}) {
  const router = useRouter();
  const [result, setResult] = useState<AdminResult>({});
  const [pending, startTransition] = useTransition();
  const submitting = useRef(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting.current || (confirm && !window.confirm(confirm))) return;
        const form = event.currentTarget;
        const data = new FormData(form);
        const uploads = data
          .getAll("images")
          .filter((value): value is File => value instanceof File);
        if (
          uploads.reduce((size, file) => size + file.size, 0) >
          4 * 1024 * 1024
        ) {
          setResult({
            error: "Tổng ảnh mỗi lượt lưu tối đa 4 MB. Hãy chọn ảnh nhỏ hơn.",
          });
          return;
        }
        submitting.current = true;
        setResult({});
        startTransition(async () => {
          try {
            const next = await action(data);
            setResult(next);
            if (!next.error) {
              form
                .querySelectorAll<HTMLInputElement>('input[type="password"]')
                .forEach((input) => {
                  input.value = "";
                });
              if (resetOnSuccess) form.reset();
              if (next.redirectTo) router.push(next.redirectTo);
              router.refresh();
            }
          } catch {
            setResult({
              error:
                "Kết nối bị gián đoạn. Dữ liệu nhập vẫn được giữ; hãy kiểm tra lại trước khi thử lưu lần nữa.",
            });
          } finally {
            submitting.current = false;
          }
        });
      }}
    >
      <fieldset
        className={`admin-form-fields ${className ?? ""}`}
        disabled={pending}
        aria-busy={pending}
      >
        {children}
      </fieldset>
      {pending ? (
        <p className="admin-form-feedback" role="status">
          Đang xử lý…
        </p>
      ) : null}
      {result.error ? (
        <p className="form-error" role="alert">
          {result.error}
        </p>
      ) : null}
      {result.message ? (
        <p className="admin-notice" role="status">
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
