"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; success?: string };

export async function updateProfile(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser("/account");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (fullName.length < 2) return { error: "Họ tên cần ít nhất 2 ký tự." };
  if (phone && !/^(?:\+84|0)[0-9]{9,10}$/.test(phone.replace(/[ .-]/g, "")))
    return { error: "Số điện thoại chưa đúng định dạng." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("user_id", user.id);
  if (error) return { error: "Chưa thể lưu thông tin. Vui lòng thử lại." };
  revalidatePath("/account");
  return { success: "Thông tin đã được cập nhật." };
}
