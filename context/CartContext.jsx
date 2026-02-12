"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext({});

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

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

  // ✅ TAMBAHKAN FUNGSI INI!
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
    loadCart();
  }, [session]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        loadCart,
        addToCart,
        removeFromCart, // ✅ WAJIB ADA!
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);