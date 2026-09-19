export function adminConfiguration(env: Record<string, string | undefined>) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key =
    env.SUPABASE_SECRET_KEY?.trim() ||
    env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "";
  let issue: string | null = null;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
  } catch {
    issue =
      "NEXT_PUBLIC_SUPABASE_URL trên máy chủ đang thiếu hoặc không hợp lệ.";
  }
  if (!issue && !key) {
    issue =
      "Máy chủ chưa có SUPABASE_SECRET_KEY (hoặc SUPABASE_SERVICE_ROLE_KEY). Khóa trong .env.local chỉ áp dụng trên máy của bạn.";
  }
  if (
    !issue &&
    (key.startsWith("sb_publishable_") ||
      key === env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim())
  ) {
    issue =
      "SUPABASE_SECRET_KEY đang dùng khóa công khai. Trang quản trị cần secret key của cùng dự án Supabase.";
  }
  return { url, key, issue };
}
