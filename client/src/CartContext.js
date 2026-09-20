import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem("ekart_cart");
    return raw ? JSON.parse(raw) : [];
  });

  const persist = (next) => {
    localStorage.setItem("ekart_cart", JSON.stringify(next));
    setItems(next);
  };

  const add = (product, qty = 1) => {
    const amount = Number(qty);
    const existing = items.find((item) => item.productId === product._id);
    if (existing) {
      persist(
        items.map((item) =>
          item.productId === product._id
            ? { ...item, qty: item.qty + amount }
            : item
        )
      );
      return;
    }
    persist([
      ...items,
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: amount,
      },
    ]);
  };

  const updateQty = (productId, qty) => {
    const amount = Number(qty);
    if (amount < 1) {
      persist(items.filter((item) => item.productId !== productId));
      return;
    }
    persist(
      items.map((item) =>
        item.productId === productId ? { ...item, qty: amount } : item
      )
    );
  };

  const remove = (productId) => {
    persist(items.filter((item) => item.productId !== productId));
  };

  const clear = () => {
    persist([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const value = useMemo(
    () => ({ items, add, updateQty, remove, clear, total }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
