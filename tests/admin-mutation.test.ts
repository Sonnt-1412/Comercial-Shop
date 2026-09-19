import { beforeEach, describe, expect, it, vi } from "vitest";
const { getUser, adminClient, isAdmin } = vi.hoisted(() => ({
  getUser: vi.fn(),
  adminClient: vi.fn(),
  isAdmin: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser } }),
}));
vi.mock("@/lib/admin", () => ({
  createAdminClient: adminClient,
  isAdminId: isAdmin,
}));
import { adminMutation } from "@/lib/admin-mutation";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SUPABASE_SECRET_KEY", "test-secret");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
});
describe("admin action authorization", () => {
  it("rejects expired sessions without constructing a privileged client", async () => {
    getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "expired" },
    });
    const mutate = vi.fn();
    const result = await adminMutation(mutate);
    expect(result.error).toContain("hết hạn");
    expect(adminClient).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });
  it("rejects ordinary customers even with a valid login", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "customer" } },
      error: null,
    });
    isAdmin.mockReturnValue(false);
    const mutate = vi.fn();
    const result = await adminMutation(mutate);
    expect(result.error).toContain("không có quyền");
    expect(mutate).not.toHaveBeenCalled();
    expect(adminClient).not.toHaveBeenCalled();
  });
  it("returns a recoverable message on a network failure", async () => {
    getUser.mockRejectedValue(new Error("network failed"));
    const result = await adminMutation(vi.fn());
    expect(result.error).toContain("kết nối");
  });
  it("runs authorized actions and returns their validation result", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "admin" } }, error: null });
    isAdmin.mockReturnValue(true);
    adminClient.mockReturnValue({ from: "db" });
    const mutate = vi.fn().mockResolvedValue({ error: "Cần tên sản phẩm." });
    expect(await adminMutation(mutate)).toEqual({ error: "Cần tên sản phẩm." });
    expect(mutate).toHaveBeenCalledWith({ from: "db" });
  });
});
