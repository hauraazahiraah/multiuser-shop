"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const loadCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        console.log("Cart loaded:", data);
        setCartItems(data);
        const count = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.ok) {
        await loadCart();
        alert("Added to cart! 🛒");
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        return await removeFromCart(cartId);
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
      console.error("Update quantity error:", error);
      return { success: false };
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      const res = await fetch(`/api/cart/${cartId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadCart();
        alert("Removed from cart 🗑️");
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        loadCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);