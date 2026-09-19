import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminId } from "@/lib/admin";

export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const session = await createClient();
    const { data, error } = await session.auth.getUser();
    if (error || !data.user)
      return Response.json(
        { error: "Cần đăng nhập." },
        { status: 401, headers },
      );
    if (!isAdminId(data.user.id))
      return Response.json(
        { error: "Không có quyền quản trị." },
        { status: 403, headers },
      );
    const supabase = createAdminClient();
    const [pending, latest] = await Promise.all([
      supabase
        .from("orders")
        .select("id,order_number,recipient_name,created_at", { count: "exact" })
        .eq("status", "pending")
        .order("id", { ascending: false })
        .limit(5),
      supabase
        .from("orders")
        .select("id,order_number")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    if (pending.error || latest.error)
      return Response.json(
        { error: "Chưa tải được thông báo." },
        { status: 503, headers },
      );
    return Response.json(
      {
        count: pending.count ?? 0,
        orders: pending.data ?? [],
        latest: latest.data,
      },
      { headers },
    );
  } catch {
    return Response.json(
      { error: "Chưa kết nối được thông báo." },
      { status: 503, headers },
    );
  }
}
