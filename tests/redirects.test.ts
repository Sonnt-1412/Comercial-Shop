import { describe, expect, it } from "vitest";
import { noticeUrl } from "@/lib/redirects";

describe("noticeUrl", () => {
  it("encodes Vietnamese notices into an ASCII-safe redirect URL", () => {
    const message = "Kiểm tra email để xác nhận tài khoản.";
    const target = noticeUrl("/login", message);

    expect(target).toMatch(/^\x2F[\x00-\x7F]+$/);
    expect(
      new URL(target, "https://example.com").searchParams.get("notice"),
    ).toBe(message);
  });

  it("preserves an existing query string", () => {
    expect(noticeUrl("/login?next=%2Faccount", "Hoàn tất")).toContain(
      "&notice=",
    );
  });
});
