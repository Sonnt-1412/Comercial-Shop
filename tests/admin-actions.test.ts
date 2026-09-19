import { beforeEach, describe, expect, it, vi } from "vitest";

const { db, revalidate } = vi.hoisted(() => ({
  db: { from: vi.fn(), rpc: vi.fn() },
  revalidate: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: revalidate }));
vi.mock("@/lib/admin-mutation", () => ({
  adminMutation: (run: (client: typeof db) => unknown) => run(db),
}));
import {
  deleteCategory,
  deleteProduct,
  saveProduct,
  updateOrder,
  saveCustomerAddress,
} from "@/app/admin/actions";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}
function query(result: unknown) {
  const builder = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    then: (resolve: (value: unknown) => unknown) =>
      Promise.resolve(result).then(resolve),
  };
  for (const method of [
    builder.select,
    builder.eq,
    builder.maybeSingle,
    builder.delete,
    builder.update,
  ])
    method.mockReturnValue(builder);
  return builder;
}

beforeEach(() => vi.clearAllMocks());
describe("admin mutations", () => {
  it("rejects blank prices without creating a zero-priced product", async () => {
    const result = await saveProduct(
      form({
        slug: "test",
        name: "Test",
        category: "board",
        price: "",
        stock: "1",
        accent: "#123456",
        art: "board",
      }),
    );
    expect(result.error).toBeTruthy();
    expect(db.from).not.toHaveBeenCalled();
  });
  it("does not overwrite stock changed by a customer order", async () => {
    db.from
      .mockReturnValueOnce(query({ data: { slug: "board" } }))
      .mockReturnValueOnce(query({ data: { images: [], updated_at: "new" } }));
    const result = await saveProduct(
      form({
        originalSlug: "test",
        slug: "test",
        name: "Test",
        category: "board",
        price: "100",
        stock: "10",
        accent: "#123456",
        art: "board",
        updatedAt: "old",
      }),
    );
    expect(result.error).toContain("tồn kho vừa thay đổi");
    expect(db.from).toHaveBeenCalledTimes(2);
  });
  it("archives ordered products when deletion is blocked by order history", async () => {
    const hide = query({ error: null });
    db.from
      .mockReturnValueOnce(query({ data: { images: [] } }))
      .mockReturnValueOnce(query({ error: { code: "23503" } }))
      .mockReturnValueOnce(hide);
    const result = await deleteProduct(form({ slug: "test" }));
    expect(result.error).toBeUndefined();
    expect(hide.update).toHaveBeenCalledWith({ is_active: false });
    expect(result.message).toContain("Đã ẩn");
  });
  it("keeps nonempty categories and explains how to remove them", async () => {
    db.from.mockReturnValue(query({ error: { code: "23503" } }));
    const result = await deleteCategory(form({ slug: "board" }));
    expect(result.error).toContain("chuyển chúng sang danh mục khác");
    expect(revalidate).not.toHaveBeenCalled();
  });
  it("does not report success when reopening an order has insufficient stock", async () => {
    db.rpc.mockResolvedValue({ error: { code: "22023" } });
    const result = await updateOrder(form({ id: "42", status: "confirmed" }));
    expect(result.error).toContain("tồn kho không đủ");
    expect(revalidate).not.toHaveBeenCalled();
  });
  it("rejects invalid order statuses without calling the database", async () => {
    const result = await updateOrder(form({ id: "42", status: "toString" }));
    expect(result.error).toBeTruthy();
    expect(db.rpc).not.toHaveBeenCalled();
  });
  it("does not create a new address when an edit contains a malformed ID", async () => {
    const result = await saveCustomerAddress(
      form({
        userId: "11111111-1111-4111-8111-111111111111",
        id: "oops",
        recipientName: "Test",
        phone: "0901234567",
        addressLine: "Test",
        ward: "Test",
        district: "Test",
        province: "Test",
      }),
    );
    expect(result.error).toBeTruthy();
    expect(db.from).not.toHaveBeenCalled();
  });
});
