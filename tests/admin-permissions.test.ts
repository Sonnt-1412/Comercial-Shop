import { describe, expect, it } from "vitest";
import { isAllowedAdminId } from "@/lib/admin-permissions";

const admin = "11111111-1111-4111-8111-111111111111";
const customer = "22222222-2222-4222-8222-222222222222";

describe("admin access", () => {
  it("only allows exact configured user IDs", () => {
    expect(isAllowedAdminId(admin, ` ${customer}, ${admin} `)).toBe(true);
    expect(isAllowedAdminId(customer, admin)).toBe(false);
    expect(isAllowedAdminId(`${admin}x`, admin)).toBe(false);
    expect(isAllowedAdminId(admin, undefined)).toBe(false);
  });
});
