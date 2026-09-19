import { describe, expect, it } from "vitest";
import { adminConfiguration } from "@/lib/admin-config";

const base = { NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co" };
describe("admin configuration", () => {
  it("explains a missing server key without exposing any secret", () => {
    expect(adminConfiguration(base).issue).toContain("SUPABASE_SECRET_KEY");
  });
  it("uses a legacy service-role key when the secret variable is blank", () => {
    const config = adminConfiguration({
      ...base,
      SUPABASE_SECRET_KEY: "  ",
      SUPABASE_SERVICE_ROLE_KEY: " legacy-key \n",
    });
    expect(config.key).toBe("legacy-key");
    expect(config.issue).toBeNull();
  });
  it("rejects a public key used as the admin key", () => {
    expect(
      adminConfiguration({
        ...base,
        SUPABASE_SECRET_KEY: "sb_publishable_test",
      }).issue,
    ).toContain("khóa công khai");
  });
  it("trims pasted credentials and validates the URL", () => {
    expect(
      adminConfiguration({
        NEXT_PUBLIC_SUPABASE_URL: " https://test.supabase.co ",
        SUPABASE_SECRET_KEY: " sb_secret_test\n",
      }),
    ).toEqual({
      url: base.NEXT_PUBLIC_SUPABASE_URL,
      key: "sb_secret_test",
      issue: null,
    });
    expect(
      adminConfiguration({
        NEXT_PUBLIC_SUPABASE_URL: "invalid",
        SUPABASE_SECRET_KEY: "secret",
      }).issue,
    ).toContain("URL");
  });
});
