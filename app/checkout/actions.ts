"use server";

import { requireUser } from "@/lib/auth";
import { sanitizeCart, type CartLine } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";

export type PlaceOrderResult = {
  error?: string;
  orderId?: number;
  orderNumber?: string;
};

export async function placeOrder(
  addressId: number,
  rawLines: CartLine[],
): Promise<PlaceOrderResult> {
  await requireUser("/checkout");
  const lines = sanitizeCart(rawLines);
  if (!Number.isSafeInteger(addressId) || lines.length === 0)
    return { error: "Chọn địa chỉ và kiểm tra lại giỏ hàng." };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("place_order", {
    p_address_id: addressId,
    p_items: lines,
  });
  if (error)
    return {
      error: error.message || "Chưa thể tạo đơn hàng. Vui lòng thử lại.",
    };
  const order = Array.isArray(data) ? data[0] : data;
  if (!order?.order_id)
    return { error: "Đơn hàng chưa được tạo. Vui lòng thử lại." };
  return {
    orderId: Number(order.order_id),
    orderNumber: String(order.order_number),
  };
}
