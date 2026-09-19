import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminId } from "@/lib/admin";
import type { AdminResult } from "@/lib/admin-forms";

export async function adminMutation(
  mutate: (
    supabase: ReturnType<typeof createAdminClient>,
  ) => Promise<AdminResult>,
): Promise<AdminResult> {
  try {
    const session = await createClient();
    const { data, error } = await session.auth.getUser();
    if (error || !data.user)
      return {
        error:
          "Phiên đăng nhập đã hết hạn. Mở trang đăng nhập ở tab khác, sau đó quay lại lưu.",
      };
    if (!isAdminId(data.user.id))
      return { error: "Tài khoản này không có quyền quản trị." };
    if (
      !process.env.SUPABASE_SECRET_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    )
      return {
        error:
          "Chưa cấu hình khóa quản trị trên máy chủ. Hãy kiểm tra cấu hình triển khai.",
      };
    return await mutate(createAdminClient());
  } catch {
    return {
      error:
        "Chưa thể kết nối để hoàn tất thao tác. Hãy kiểm tra dữ liệu hiện tại trước khi thử lại.",
    };
  }
}
