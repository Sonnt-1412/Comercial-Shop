import { describe, expect, it } from "vitest";
import {
  integerField,
  productImagePaths,
  searchText,
  adminPage,
} from "@/lib/admin-forms";

describe("admin input safeguards", () => {
  it("requires explicit integer prices and stock rather than treating blanks as zero", () => {
    expect(integerField("", 0, 100)).toBeNull();
    expect(integerField("1.5", 0, 100)).toBeNull();
    expect(integerField("1e2", 0, 100)).toBeNull();
    expect(integerField("-1", 0, 100)).toBeNull();
    expect(integerField("101", 0, 100)).toBeNull();
    expect(integerField("0", 0, 100)).toBe(0);
    expect(integerField("12", 0, 100)).toBe(12);
  });
  it("normalizes invalid pagination and strips filter operators from searches", () => {
    expect(adminPage("Infinity")).toBe(1);
    expect(adminPage("-10")).toBe(1);
    expect(adminPage("2")).toBe(2);
    expect(searchText("Cảm biến")).toBe("Cảm biến");
    expect(searchText("x%,is_active.eq.true")).not.toMatch(/[%(),]/);
  });
  it("only removes images belonging to this project's product folder", () => {
    const origin = "https://shop.supabase.co";
    expect(
      productImagePaths(
        [
          `${origin}/storage/v1/object/public/product-images/test/photo.jpg`,
          "https://other.supabase.co/storage/v1/object/public/product-images/test/photo.jpg",
          `${origin}/storage/v1/object/public/product-images/other/photo.jpg`,
          "invalid",
        ],
        "test",
        origin,
      ),
    ).toEqual(["test/photo.jpg"]);
  });
});
