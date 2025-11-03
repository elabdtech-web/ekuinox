import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";

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
  const { isAuthenticated } = useAuth();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Sync local cart to server when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      const syncLocalCartToServer = async () => {
        try {
          const localCart = localStorage.getItem('guestCart');
          if (!localCart) return;

          const parsedCart = JSON.parse(localCart);
          if (parsedCart.length === 0) return;

          // Add each item from local cart to server cart
          for (const item of parsedCart) {
            try {
              const cartItemData = cartService.formatCartItem(item);
              await cartService.addToCart(cartItemData);
            } catch (error) {
              console.error('Failed to sync item to server:', item, error);
            }
          }

          // Clear local cart after successful sync
          localStorage.removeItem('guestCart');

          // Reload cart from server
          await loadCart();
        } catch (error) {
          console.error('Failed to sync local cart to server:', error);
        }
      };

      syncLocalCartToServer();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        // Load from localStorage for guest users
        const localCart = localStorage.getItem('guestCart');
        if (localCart) {
          const parsedCart = JSON.parse(localCart);
          setItems(parsedCart);
        }
        return;
      }

      // Load from API if authenticated
      const cartData = await cartService.getCart();
      console.log('Raw cart data from API:', cartData);

      // Normalize to an array of items regardless of envelope shape
      let cartItems = [];
      if (Array.isArray(cartData)) {
        cartItems = cartData;
      } else if (cartData && typeof cartData === 'object') {
        if (Array.isArray(cartData.items)) {
          cartItems = cartData.items;
        } else if (Array.isArray(cartData.data?.items)) {
          cartItems = cartData.data.items;
        } else if (Array.isArray(cartData.cart?.items)) {
          cartItems = cartData.cart.items;
        } else if (Array.isArray(cartData.data)) {
          cartItems = cartData.data;
        } else if (Array.isArray(cartData.products)) {
          cartItems = cartData.products;
        } else {
          console.warn('Cart data does not contain an items array. Using empty list. Shape:', cartData);
          cartItems = [];
        }
      }

      // Transform API data to match our format
      const transformedItems = cartItems.map(item => ({
        id: item._id || item.id, // cart item id
        productId: item.productId?._id || item.productId || item.product?.id,
        name: item.name || item.product?.name,
        price: typeof item.price === 'number' ? `$${item.price}` : (item.price || '$0.00'),
        priceNum: typeof item.price === 'number' ? item.price : parseFloat(item.price || 0),
        img: item.image || item.img || item.product?.image || item.product?.img,
        qty: item.quantity || item.qty || 1,
        size: item.size,
        color: item.color,
        edition: item.edition
      }));

      setItems(transformedItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setError(error.message);
      // Keep local cart if API fails - don't clear existing items
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product) => {
    try {
      setError(null);

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to local state and localStorage if not authenticated
        setItems((prev) => {
          const existing = prev.find((p) => p.id === product.id);
          let newItems;
          if (existing) {
            newItems = prev.map((p) =>
              p.id === product.id ? { ...p, qty: p.qty + 1 } : p
            );
          } else {
            newItems = [...prev, {
              ...product,
              qty: product.qty ?? 1,
              priceNum: parseFloat(String(product.price).replace(/[^0-9.]/g, '') || 0)
            }];
          }
          // Save to localStorage
          localStorage.setItem('guestCart', JSON.stringify(newItems));
          return newItems;
        });
        return;
      }

      // Use API if authenticated
      const cartItemData = cartService.formatCartItem(product);
      await cartService.addToCart(cartItemData);

      // Reload cart to get updated data
      await loadCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setError(error.message);

      // Fallback to local state on API error
      setItems((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        let newItems;
        if (existing) {
          newItems = prev.map((p) =>
            p.id === product.id ? { ...p, qty: p.qty + 1 } : p
          );
        } else {
          newItems = [...prev, {
            ...product,
            qty: product.qty ?? 1,
            priceNum: parseFloat(String(product.price).replace(/[^0-9.]/g, '') || 0)
          }];
        }
        // Save to localStorage
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const remove = async (id) => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to local state and localStorage
        setItems((prev) => {
          const newItems = prev.filter((p) => p.id !== id);
          localStorage.setItem('guestCart', JSON.stringify(newItems));
          return newItems;
        });
        return;
      }

      // Use API if authenticated
      await cartService.removeFromCart(id);

      // Reload cart
      await loadCart();
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      setError(error.message);

      // Fallback to local state
      setItems((prev) => {
        const newItems = prev.filter((p) => p.id !== id);
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const inc = async (id) => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to local state and localStorage
        setItems((prev) => {
          const newItems = prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p));
          localStorage.setItem('guestCart', JSON.stringify(newItems));
          return newItems;
        });
        return;
      }

      // Find current item
      const currentItem = items.find(item => item.id === id);
      if (!currentItem) return;

      // Use API if authenticated
      await cartService.updateCartItem(id, { quantity: currentItem.qty + 1 });

      // Reload cart
      await loadCart();
    } catch (error) {
      console.error('Failed to increment item quantity:', error);
      setError(error.message);

      // Fallback to local state
      setItems((prev) => {
        const newItems = prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p));
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const dec = async (id) => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to local state and localStorage
        setItems((prev) => {
          const newItems = prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p));
          localStorage.setItem('guestCart', JSON.stringify(newItems));
          return newItems;
        });
        return;
      }

      // Find current item
      const currentItem = items.find(item => item.id === id);
      if (!currentItem || currentItem.qty <= 1) return;

      // Use API if authenticated
      await cartService.updateCartItem(id, { quantity: currentItem.qty - 1 });

      // Reload cart
      await loadCart();
    } catch (error) {
      console.error('Failed to decrement item quantity:', error);
      setError(error.message);

      // Fallback to local state
      setItems((prev) => {
        const newItems = prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p));
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const clearCart = async () => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to local state and localStorage
        setItems([]);
        localStorage.removeItem('guestCart');
        return;
      }

      // Use API if authenticated
      await cartService.clearCart();

      // Reload cart
      await loadCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError(error.message);

      // Fallback to local state
      setItems([]);
      localStorage.removeItem('guestCart');
    }
  };

  const checkout = async (checkoutData = {}) => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to checkout');
      }

      // Use API for checkout
      const result = await cartService.checkoutCart(checkoutData);

      // Clear cart after successful checkout
      setItems([]);

      return result;
    } catch (error) {
      console.error('Checkout failed:', error);
      setError(error.message);
      throw error;
    }
  };

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

  const delivery = items.length ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + delivery;

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
    loadCart
  };

  return (
    <ProductCartContext.Provider value={value}>
      {children}
    </ProductCartContext.Provider>
  );
}
