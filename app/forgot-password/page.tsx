import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { requestPasswordReset } from "@/app/login/actions";

export const metadata: Metadata = { title: "Khôi phục mật khẩu" };

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page shell" id="main-content">
      <section className="auth-panel">
        <p className="eyebrow">
          <span className="eyebrow-line" /> Account / Recovery
        </p>
        <h1>Quên mật khẩu</h1>
        <p>Nhập email của bạn. Chúng tôi sẽ gửi liên kết tạo mật khẩu mới.</p>
        <AuthForm action={requestPasswordReset} mode="forgot" />
      </section>
    </main>
  );
}
