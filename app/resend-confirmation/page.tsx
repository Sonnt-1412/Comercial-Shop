import type { Metadata } from "next";
import { resendConfirmation } from "@/app/login/actions";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Gửi lại email xác nhận" };

export default function ResendConfirmationPage() {
  return (
    <main className="auth-page shell" id="main-content">
      <section className="auth-panel">
        <p className="eyebrow">
          <span className="eyebrow-line" /> Account / Confirmation
        </p>
        <h1>Gửi lại email xác nhận</h1>
        <p>
          Nhập email đã đăng ký. Chúng tôi sẽ gửi một liên kết xác nhận mới.
        </p>
        <AuthForm action={resendConfirmation} mode="resend" />
      </section>
    </main>
  );
}
