import { getProduct, type Product } from "@/lib/products";

export type CartLine = { slug: string; quantity: number };
export type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; slug: string }
  | { type: "set"; slug: string; quantity: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

export const CART_STORAGE_KEY = "nor-shop:cart:v1";

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  if (action.type === "hydrate") return sanitizeCart(action.lines);
  if (action.type === "clear") return [];
  if (action.type === "remove")
    return lines.filter((line) => line.slug !== action.slug);
  if (action.type === "set") {
    if (action.quantity <= 0)
      return lines.filter((line) => line.slug !== action.slug);
    return lines.map((line) =>
      line.slug === action.slug
        ? { ...line, quantity: Math.min(99, action.quantity) }
        : line,
    );
  }
  const existing = lines.find((line) => line.slug === action.slug);
  if (existing)
    return lines.map((line) =>
      line.slug === action.slug
        ? { ...line, quantity: Math.min(99, line.quantity + 1) }
        : line,
    );
  if (lines.length >= 50) return lines;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(action.slug)
    ? [...lines, { slug: action.slug, quantity: 1 }]
    : lines;
}

export function sanitizeCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const merged = new Map<string, number>();
  for (const item of value) {
    if (merged.size >= 50) break;
    if (!item || typeof item !== "object") continue;
    const slug =
      "slug" in item && typeof item.slug === "string" ? item.slug : "";
    const quantity =
      "quantity" in item && typeof item.quantity === "number"
        ? Math.floor(item.quantity)
        : 0;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || quantity < 1) continue;
    merged.set(slug, Math.min(99, (merged.get(slug) ?? 0) + quantity));
  }
  return Array.from(merged, ([slug, quantity]) => ({ slug, quantity }));
}

export function cartDetails(
  lines: CartLine[],
  catalog?: Product[],
): Array<{ product: Product; quantity: number }> {
  return lines.flatMap((line) => {
    const product = catalog
      ? catalog.find((item) => item.slug === line.slug)
      : getProduct(line.slug);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
}

export function hasUnavailableItems(
  details: Array<{ product: Product; quantity: number }>,
) {
  return details.some(
    ({ product, quantity }) => quantity > (product.stock ?? 99),
  );
}
