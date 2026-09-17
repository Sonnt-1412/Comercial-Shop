import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/app/account/profile-form";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isAdminId } from "@/lib/admin";

export const metadata: Metadata = { title: "Tài khoản" };

export default async function AccountPage() {
  const user = await requireUser("/account");
  const supabase = await createClient();
  const [{ data: profile }, { count: addressCount }, { count: orderCount }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase.from("addresses").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
    ]);
  return (
    <section>
      {isAdminId(user.id) ? <p><Link className="text-link" href="/admin">Mở trang quản trị →</Link></p> : null}
      <div className="account-section-heading">
        <div>
          <span>01 / Hồ sơ</span>
          <h2>Thông tin cá nhân</h2>
        </div>
        <div className="account-stats">
          <span>
            <strong>{addressCount ?? 0}</strong> địa chỉ
          </span>
          <span>
            <strong>{orderCount ?? 0}</strong> đơn hàng
          </span>
        </div>
      </div>
      <ProfileForm
        email={user.email}
        fullName={profile?.full_name ?? ""}
        phone={profile?.phone ?? ""}
      />
    </section>
  );
}
