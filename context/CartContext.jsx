"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext({});

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  const loadCart = async () => {
    if (!session?.user?.id) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
        const count = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!session?.user?.id) {
      alert("Please login first");
      return { success: false };
    }

    try {
      // 🔥 AMBIL DATA PRODUK (buat cek stok)
      const productRes = await fetch("/api/product");
      const products = await productRes.json();
      const product = products.find(p => p.id === productId);

      if (!product) {
        return { success: false, error: "Product tidak ditemukan" };
      }

      // 🔥 CEK QTY DI CART
      const itemInCart = cartItems.find(item => item.productId === productId);
      const currentQty = itemInCart ? itemInCart.quantity : 0;

      // 🔥 VALIDASI STOK
      if (currentQty + quantity > product.stock) {
        return { success: false, error: "Stock tidak cukup" };
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.ok) {
        await loadCart();
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  const removeFromCart = async (cartId) => {
    if (!session?.user?.id) {
      alert("Please login first");
      return { success: false };
    }

    try {
      const res = await fetch(`/api/cart/${cartId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      return { success: false };
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (!session?.user?.id) return { success: false };

    try {
      // 🔥 AMBIL ITEM CART
      const item = cartItems.find(i => i.id === cartId);
      if (!item) return { success: false };

      // 🔥 AMBIL DATA PRODUK
      const productRes = await fetch("/api/product");
      const products = await productRes.json();
      const product = products.find(p => p.id === item.productId);

      if (!product) return { success: false };

      // 🔥 VALIDASI
      if (newQuantity > product.stock) {
        return { success: false, error: "Melebihi stok" };
      }

      const res = await fetch(`/api/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (res.ok) {
        await loadCart();
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadCart();
    }
  }, [session, mounted]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        loadCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);