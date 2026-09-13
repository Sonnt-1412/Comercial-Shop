import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/auth";
import { noticeUrl } from "@/lib/redirects";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(
    new URL(
      noticeUrl("/login", "Liên kết đăng nhập không hợp lệ hoặc đã hết hạn."),
      request.url,
    ),
  );
}
