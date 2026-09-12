import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser, safeNext } from "@/lib/auth";
import { signIn } from "@/app/login/actions";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getCurrentUser()) redirect(next);
  return (
    <main className="auth-page shell" id="main-content">
      <section className="auth-panel">
        <p className="eyebrow">
          <span className="eyebrow-line" /> Account / Returning builder
        </p>
        <h1>Đăng nhập</h1>
        <p>
          Đăng nhập để lưu địa chỉ, xác nhận đơn và theo dõi quá trình giao
          hàng.
        </p>
        {params.notice ? (
          <p className="form-notice" role="status">
            {params.notice}
          </p>
        ) : null}
        <AuthForm action={signIn} mode="login" next={next} />
      </section>
    </main>
  );
}
