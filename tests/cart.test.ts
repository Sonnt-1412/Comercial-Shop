import { describe, expect, it } from "vitest";
import { cartDetails, cartReducer, sanitizeCart } from "@/lib/cart";

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

  it("rejects unknown products and unsafe quantities when hydrating", () => {
    expect(
      sanitizeCart([
        { slug: "unknown", quantity: 2 },
        { slug: "esp32-development-board", quantity: -1 },
        { slug: "esp32-development-board", quantity: 120 },
      ]),
    ).toEqual([{ slug: "esp32-development-board", quantity: 99 }]);
  });

  it("derives trusted product details from slugs", () => {
    const details = cartDetails([
      { slug: "bme280-environment-sensor", quantity: 2 },
    ]);
    expect(details[0].product.price * details[0].quantity).toBe(160000);
  });
});
