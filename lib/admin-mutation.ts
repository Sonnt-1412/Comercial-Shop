import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminId } from "@/lib/admin";
import type { AdminResult } from "@/lib/admin-forms";
import { adminConfiguration } from "@/lib/admin-config";

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
    const { issue } = adminConfiguration(process.env);
    if (issue) return { error: issue };
    return await mutate(createAdminClient());
  } catch {
    return {
      error:
        "Chưa thể kết nối để hoàn tất thao tác. Hãy kiểm tra dữ liệu hiện tại trước khi thử lại.",
    };
  }
}
