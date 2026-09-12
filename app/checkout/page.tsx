import type { Metadata } from "next";
import { CheckoutView } from "@/app/checkout/checkout-view";
import type { Address } from "@/components/address-form";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Xác nhận đơn hàng" };

export default async function CheckoutPage() {
  await requireUser("/checkout");
  const supabase = await createClient();
  const { data } = await supabase
    .from("addresses")
    .select(
      "id, recipient_name, phone, address_line, ward, district, province, note, is_default",
    )
    .order("is_default", { ascending: false })
    .order("created_at");
  return (
    <main className="commerce-page shell" id="main-content">
      <div className="commerce-heading">
        <p className="eyebrow">
          <span className="eyebrow-line" /> Checkout / No online payment
        </p>
        <h1>Xác nhận đơn</h1>
      </div>
      <CheckoutView addresses={(data ?? []) as Address[]} />
    </main>
  );
}
