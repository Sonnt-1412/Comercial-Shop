import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { signUp } from "@/app/login/actions";
import { safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "Tạo tài khoản" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);
  return (
    <main className="auth-page shell" id="main-content">
      <section className="auth-panel">
        <h1>Tạo tài khoản</h1>
        <p>Một tài khoản để lưu địa chỉ và theo dõi tất cả đơn hàng của bạn.</p>
        <AuthForm action={signUp} mode="register" next={next} />
      </section>
    </main>
  );
}
