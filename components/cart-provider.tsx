"use client";

import {
  createContext,
  use,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { CART_STORAGE_KEY, cartReducer, type CartLine } from "@/lib/cart";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  addItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      dispatch({ type: "hydrate", lines: stored ? JSON.parse(stored) : [] });
    } catch {
      dispatch({ type: "hydrate", lines: [] });
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated)
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [hydrated, lines]);

  return (
    <CartContext
      value={{
        lines,
        count: lines.reduce((total, line) => total + line.quantity, 0),
        hydrated,
        addItem: (slug) => dispatch({ type: "add", slug }),
        setQuantity: (slug, quantity) =>
          dispatch({ type: "set", slug, quantity }),
        removeItem: (slug) => dispatch({ type: "remove", slug }),
        clearCart: () => dispatch({ type: "clear" }),
      }}
    >
      {children}
    </CartContext>
  );
}

export function useCart() {
  const context = use(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
