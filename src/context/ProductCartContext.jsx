import React, { createContext, useContext, useState, useMemo } from "react";

const ProductCartContext = createContext(undefined);

export const useProductCart = () => {
  const ctx = useContext(ProductCartContext);
  if (!ctx)
    throw new Error("useProductCart must be used within ProductCartProvider");
  return ctx;
};

export function ProductCartProvider({ children }) {
  const [items, setItems] = useState([]); // { id, name, price, priceNum, img, qty }

  const addItem = (product) =>
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: product.qty ?? 1 }];
    });

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const inc = (id) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  const dec = (id) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p))
    );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, it) =>
          s +
          Number(it.priceNum ?? String(it.price).replace(/[^0-9.]/g, "")) *
            (it.qty ?? 1),
        0
      ),
    [items]
  );

  const delivery = items.length ? 50 : 0;
  const total = subtotal + delivery;

  const value = { items, addItem, remove, inc, dec, subtotal, delivery, total };
  return (
    <ProductCartContext.Provider value={value}>
      {children}
    </ProductCartContext.Provider>
  );
}
