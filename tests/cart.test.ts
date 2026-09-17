import { describe, expect, it } from "vitest";
import {
  cartDetails,
  cartReducer,
  hasUnavailableItems,
  sanitizeCart,
} from "@/lib/cart";

describe("cart", () => {
  it("adds, increments, decrements, and removes a product", () => {
    let cart = cartReducer([], {
      type: "add",
      slug: "esp32-development-board",
    });
    cart = cartReducer(cart, { type: "add", slug: "esp32-development-board" });
    expect(cart).toEqual([{ slug: "esp32-development-board", quantity: 2 }]);
    cart = cartReducer(cart, {
      type: "set",
      slug: "esp32-development-board",
      quantity: 1,
    });
    expect(cart[0].quantity).toBe(1);
    expect(
      cartReducer(cart, { type: "remove", slug: "esp32-development-board" }),
    ).toEqual([]);
  });

  it("accepts dynamic product slugs but rejects invalid shapes and quantities", () => {
    expect(
      sanitizeCart([
        { slug: "unknown", quantity: 2 },
        { slug: "esp32-development-board", quantity: -1 },
        { slug: "esp32-development-board", quantity: 120 },
      ]),
    ).toEqual([
      { slug: "unknown", quantity: 2 },
      { slug: "esp32-development-board", quantity: 99 },
    ]);
  });

  it("derives trusted product details from slugs", () => {
    const details = cartDetails([
      { slug: "bme280-environment-sensor", quantity: 2 },
    ]);
    expect(details[0].product.price * details[0].quantity).toBe(160000);
  });

  it("uses the current catalog for newly added products", () => {
    const product = {
      slug: "new-board",
      name: "New Board",
      shortName: "New Board",
      category: "board",
      categoryLabel: "Board",
      price: 99000,
      status: "Còn hàng" as const,
      description: "",
      art: "board" as const,
      accent: "#c8a96b",
      specs: [],
      stock: 5,
    };
    expect(
      cartDetails([{ slug: "new-board", quantity: 2 }], [product]),
    ).toEqual([{ product, quantity: 2 }]);
    expect(
      cartDetails([{ slug: "removed-board", quantity: 1 }], [product]),
    ).toEqual([]);
    expect(hasUnavailableItems([{ product, quantity: 6 }])).toBe(true);
    expect(hasUnavailableItems([{ product, quantity: 5 }])).toBe(false);
  });
});
