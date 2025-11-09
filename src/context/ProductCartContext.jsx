import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";
import { productService } from "../services/productService";

const ProductCartContext = createContext(undefined);

export const useProductCart = () => {
  const ctx = useContext(ProductCartContext);
  if (!ctx)
    throw new Error("useProductCart must be used within ProductCartProvider");
  return ctx;
};

export function ProductCartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // ------------------------------
  // Load cart on mount
  // ------------------------------
  useEffect(() => {
    loadCart();
  }, []);

  // ------------------------------
  // Sync local guest cart to server on login
  // ------------------------------
  useEffect(() => {
    if (isAuthenticated) {
      const syncLocalCartToServer = async () => {
        try {
          const localCart = localStorage.getItem("guestCart");
          if (!localCart) return;

          const parsedCart = JSON.parse(localCart);
          if (parsedCart.length === 0) return;

          for (const item of parsedCart) {
            try {
              const cartItemData = cartService.formatCartItem(item);
              await cartService.addToCart(cartItemData);
            } catch (error) {
              console.error("Failed to sync item to server:", item, error);
            }
          }

          localStorage.removeItem("guestCart");
          await loadCart();
        } catch (error) {
          console.error("Failed to sync local cart to server:", error);
        }
      };
      syncLocalCartToServer();
    }
  }, [isAuthenticated]);

  // ------------------------------
  // Load cart (from local or server)
  // ------------------------------
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      // GUEST CART
      if (!token) {
        const localCart = localStorage.getItem("guestCart");
        if (localCart) {
          const parsedCart = JSON.parse(localCart);
          setItems(parsedCart);
        }
        return;
      }

      // AUTH CART (API)
      const cartData = await cartService.getCart();
      console.log("Raw cart data from API:", cartData);

      let cartItems = [];
      if (Array.isArray(cartData)) {
        cartItems = cartData;
      } else if (cartData && typeof cartData === "object") {
        cartItems =
          cartData.items ||
          cartData.data?.items ||
          cartData.cart?.items ||
          cartData.data ||
          cartData.products ||
          [];
      }

      // Normalize/transform items
      const transformedItems = cartItems.map((item) => {
        console.log('Transforming cart item:', item);
        console.log('Item colors:', item.colors);
        console.log('Item product:', item.product);

        // Get image from colors array or fallback to other sources
        const imageUrl = item.colors?.[0]?.thumb ||
          item.product?.colors?.[0]?.thumb ||
          item.img ||
          item.image ||
          item.product?.image ||
          item.product?.img;

        console.log('Final image URL:', imageUrl);

        return {
          id: item._id || item.id,
          productId: item.productId?._id || item.productId || item.product?.id,
          name: item.name || item.product?.name,
          price:
            typeof item.price === "number" ? `$${item.price}` : item.price || "$0.00",
          priceNum:
            typeof item.price === "number"
              ? item.price
              : parseFloat(String(item.price).replace(/[^0-9.]/g, "") || 0),
          img: imageUrl,
          colors: item.colors || item.product?.colors || [],
          qty: item.quantity || item.qty || 1,
          size: item.size,
          color: item.color,
          edition: item.edition,
        };
      });

      // Try fetching missing images
      const itemsWithoutImg = transformedItems.filter((i) => !i.img && i.productId);
      if (itemsWithoutImg.length) {
        try {
          const results = await Promise.all(
            itemsWithoutImg.map(async (it) => {
              try {
                const prod = await productService.getProduct(it.productId);
                return { id: it.id, img: prod?.image || prod?.img };
              } catch {
                return { id: it.id, img: null };
              }
            })
          );
          results.forEach((r) => {
            if (r.img) {
              const item = transformedItems.find((i) => i.id === r.id);
              if (item) item.img = r.img;
            }
          });
        } catch (error) {
          console.error("Failed to fetch product images:", error);
        }
      }

      // ✅ Merge with local items to preserve local fields (color, size, edition)
      setItems((prev) =>
        transformedItems.map((newItem) => {
          const existing =
            prev.find(
              (p) =>
                p.productId === newItem.productId ||
                p.id === newItem.id
            ) || {};
          return { ...existing, ...newItem };
        })
      );
    } catch (error) {
      console.error("Failed to load cart:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Add item to cart
  // ------------------------------
  const addItem = async (product) => {
    console.log("Adding item to cart:", product);
    try {
      setError(null);
      const token = localStorage.getItem("token");

      // GUEST MODE
      if (!token) {
        setItems((prev) => {
          const existing = prev.find((p) => p.id === product._id || p.id === product.id);
          let newItems;
          if (existing) {
            newItems = prev.map((p) =>
              p.id === (product._id || product.id)
                ? { ...p, qty: p.qty + 1 }
                : p
            );
          } else {
            newItems = [
              ...prev,
              {
                ...product,
                id: product._id || product.id,
                img: product.colors?.[0]?.thumb || product.img || product.image,
                colors: product.colors || [],
                qty: product.qty ?? 1,
                priceNum: parseFloat(
                  String(product.price).replace(/[^0-9.]/g, "") || 0
                ),
              },
            ];
          }
          localStorage.setItem("guestCart", JSON.stringify(newItems));
          return newItems;
        });
        return;
      }

      // AUTH MODE (API)
      const cartItemData = cartService.formatCartItem(product);
      await cartService.addToCart(cartItemData);
      await loadCart();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setError(error.message);

      // Fallback local
      setItems((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        let newItems;
        if (existing) {
          newItems = prev.map((p) =>
            p.id === product.id ? { ...p, qty: p.qty + 1 } : p
          );
        } else {
          newItems = [
            ...prev,
            {
              ...product,
              id: product._id || product.id,
              img: product.colors?.[0]?.thumb || product.img || product.image,
              colors: product.colors || [],
              qty: product.qty ?? 1,
              priceNum: parseFloat(
                String(product.price).replace(/[^0-9.]/g, "") || 0
              ),
            },
          ];
        }
        localStorage.setItem("guestCart", JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  // ------------------------------
  // Remove, Inc, Dec, Clear, Checkout
  // ------------------------------
  const remove = async (id) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setItems((prev) => {
          const newItems = prev.filter((p) => p.id !== id);
          localStorage.setItem("guestCart", JSON.stringify(newItems));
          return newItems;
        });
        return;
      }
      await cartService.removeFromCart(id);
      await loadCart();
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      setError(error.message);
    }
  };

  const inc = async (id) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setItems((prev) => {
          const newItems = prev.map((p) =>
            p.id === id ? { ...p, qty: p.qty + 1 } : p
          );
          localStorage.setItem("guestCart", JSON.stringify(newItems));
          return newItems;
        });
        return;
      }
      const current = items.find((i) => i.id === id);
      if (!current) return;
      await cartService.updateCartItem(id, { quantity: current.qty + 1 });
      await loadCart();
    } catch (error) {
      console.error("Failed to increment item:", error);
      setError(error.message);
    }
  };

  const dec = async (id) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setItems((prev) => {
          const newItems = prev.map((p) =>
            p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p
          );
          localStorage.setItem("guestCart", JSON.stringify(newItems));
          return newItems;
        });
        return;
      }
      const current = items.find((i) => i.id === id);
      if (!current || current.qty <= 1) return;
      await cartService.updateCartItem(id, { quantity: current.qty - 1 });
      await loadCart();
    } catch (error) {
      console.error("Failed to decrement item:", error);
      setError(error.message);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setItems([]);
        localStorage.removeItem("guestCart");
        return;
      }
      await cartService.clearCart();
      await loadCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      setError(error.message);
    }
  };

  const checkout = async (checkoutData = {}) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to checkout");
      const result = await cartService.checkoutCart(checkoutData);
      setItems([]);
      return result;
    } catch (error) {
      console.error("Checkout failed:", error);
      setError(error.message);
      throw error;
    }
  };

  // ------------------------------
  // Totals & UI controls
  // ------------------------------
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) =>
          sum +
          Number(it.priceNum ?? String(it.price).replace(/[^0-9.]/g, "")) *
          (it.qty ?? 1),
        0
      ),
    [items]
  );

  const delivery = items.length ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + delivery;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const value = {
    items,
    loading,
    error,
    addItem,
    remove,
    inc,
    dec,
    clearCart,
    checkout,
    subtotal,
    delivery,
    total,
    loadCart,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
  };

  return (
    <ProductCartContext.Provider value={value}>
      {children}
    </ProductCartContext.Provider>
  );
}
