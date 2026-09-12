"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import type { FormState } from "@/app/account/actions";
import { createClient } from "@/lib/supabase/server";

function addressPayload(formData: FormData, userId: string) {
  return {
    user_id: userId,
    recipient_name: String(formData.get("recipientName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address_line: String(formData.get("addressLine") ?? "").trim(),
    ward: String(formData.get("ward") ?? "").trim(),
    district: String(formData.get("district") ?? "").trim(),
    province: String(formData.get("province") ?? "").trim(),
    note: String(formData.get("note") ?? "").trim() || null,
    is_default: formData.get("isDefault") === "on",
  };
}

export async function saveAddress(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser("/account/addresses");
  const payload = addressPayload(formData, user.id);
  if (
    Object.values(payload).some(
      (value, index) =>
        index > 0 && index < 7 && typeof value === "string" && !value,
    )
  )
    return { error: "Điền đầy đủ thông tin giao hàng bắt buộc." };
  if (!/^(?:\+84|0)[0-9]{9,10}$/.test(payload.phone.replace(/[ .-]/g, "")))
    return { error: "Số điện thoại chưa đúng định dạng." };
  const supabase = await createClient();
  const id = Number(formData.get("id"));
  const query =
    Number.isSafeInteger(id) && id > 0
      ? supabase.from("addresses").update(payload).eq("id", id)
      : supabase.from("addresses").insert(payload);
  const { error } = await query;
  if (error)
    return { error: "Chưa thể lưu địa chỉ. Vui lòng kiểm tra và thử lại." };
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return {
    success: id ? "Địa chỉ đã được cập nhật." : "Địa chỉ mới đã được lưu.",
  };
}

export async function deleteAddress(formData: FormData) {
  await requireUser("/account/addresses");
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id)) return;
  const supabase = await createClient();
  await supabase.from("addresses").delete().eq("id", id);
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}

export async function setDefaultAddress(formData: FormData) {
  await requireUser("/account/addresses");
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id)) return;
  const supabase = await createClient();
  await supabase.from("addresses").update({ is_default: true }).eq("id", id);
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}
