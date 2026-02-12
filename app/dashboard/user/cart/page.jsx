"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, loadCart, updateQuantity, removeFromCart, cartCount } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = async (cartId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      if (confirm("Remove item from cart?")) {
        await removeFromCart(cartId);
      }
    } else {
      await updateQuantity(cartId, newQty);
    }
  };

  // ✅ Fungsi ini tidak dipakai lagi, tapi dibiarkan agar tidak menghapus kode yang sudah ada
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Checkout successful! 🎉");
        loadCart();
        router.push("/dashboard/user");
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch (error) {
      alert("Checkout failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #eaeaea",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/dashboard/user")}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#000000",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            🍜
          </div>
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#000000",
                margin: 0,
                letterSpacing: "-0.3px",
              }}
            >
              FoodieDash
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#6b6b6b",
                margin: "4px 0 0 0",
              }}
            >
              Shopping Cart
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "10px",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => router.push("/dashboard/user/cart")}
          >
            <span style={{ fontSize: "20px" }}>🛒</span>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 600,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#f5f5f5",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#404040",
              fontWeight: 600,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            U
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
              fontSize: "14px",
              color: "#8c8c8c",
            }}
          >
            <span
              style={{ cursor: "pointer", color: "#8c8c8c" }}
              onClick={() => router.push("/dashboard/user")}
            >
              Dashboard
            </span>
            <span style={{ color: "#eaeaea" }}>/</span>
            <span style={{ color: "#000000", fontWeight: 500 }}>Cart</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#000000",
              marginBottom: "24px",
              letterSpacing: "-0.5px",
            }}
          >
            Your Cart
          </h1>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "60px 40px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                border: "1px solid #eaeaea",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#000000",
                  marginBottom: "8px",
                }}
              >
                Your cart is empty
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b6b6b",
                  marginBottom: "24px",
                }}
              >
                Looks like you haven't added any items yet
              </p>
              <button
                onClick={() => router.push("/dashboard/user/products")}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000000")}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
              {/* Cart Items Container */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  border: "1px solid #eaeaea",
                }}
              >
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div
                      style={{
                        display: "flex",
                        padding: "24px",
                        gap: "24px",
                        alignItems: "center",
                      }}
                    >
                      {/* Product Image */}
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundColor: "#fafafa",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #eaeaea",
                          overflow: "hidden",
                        }}
                      >
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "40px", color: "#cccccc" }}>🍽️</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#000000",
                            margin: 0,
                            marginBottom: "4px",
                          }}
                        >
                          {item.product.name}
                        </h4>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#6b6b6b",
                            margin: 0,
                            marginBottom: "8px",
                          }}
                        >
                          {item.product.category}
                        </p>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#000000",
                            margin: 0,
                          }}
                        >
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls - PLUS MINUS LIKE SHOPEE */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #eaeaea",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                            style={{
                              width: "36px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#ffffff",
                              border: "none",
                              borderRight: "1px solid #eaeaea",
                              cursor: "pointer",
                              fontSize: "18px",
                              fontWeight: 500,
                              color: "#404040",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                          >
                            −
                          </button>
                          <span
                            style={{
                              width: "50px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#000000",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                            style={{
                              width: "36px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#ffffff",
                              border: "none",
                              borderLeft: "1px solid #eaeaea",
                              cursor: "pointer",
                              fontSize: "18px",
                              fontWeight: 500,
                              color: "#404040",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                          >
                            +
                          </button>
                        </div>

                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#000000",
                            minWidth: "120px",
                            textAlign: "right",
                          }}
                        >
                          {formatRupiah(item.product.price * item.quantity)}
                        </span>

                        <button
                          onClick={() => {
                            if (confirm("Remove this item from cart?")) {
                              removeFromCart(item.id);
                            }
                          }}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "transparent",
                            color: "#8c8c8c",
                            border: "1px solid #eaeaea",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#fff1f0";
                            e.currentTarget.style.color = "#cf1322";
                            e.currentTarget.style.borderColor = "#ffccc7";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#8c8c8c";
                            e.currentTarget.style.borderColor = "#eaeaea";
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>🗑️</span>
                          Remove
                        </button>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && (
                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "#eaeaea",
                          margin: "0 24px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Checkout Card */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  padding: "24px 32px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  border: "1px solid #eaeaea",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b6b6b",
                      margin: 0,
                      marginBottom: "4px",
                    }}
                  >
                    Total Price
                  </p>
                  <h2
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#000000",
                      margin: 0,
                    }}
                  >
                    {formatRupiah(total)}
                  </h2>
                </div>
                {/* ✅ TOMBOL CHECKOUT LANGSUNG KE HALAMAN CHECKOUT */}
                <button
                  onClick={() => router.push("/dashboard/user/checkout")}
                  style={{
                    padding: "16px 48px",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#333333";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#000000";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Checkout
                </button>
              </div>

              {/* Continue Shopping Button */}
              <div style={{ marginTop: "16px" }}>
                <button
                  onClick={() => router.push("/dashboard/user/products")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "transparent",
                    color: "#404040",
                    border: "1px solid #eaeaea",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                    e.currentTarget.style.borderColor = "#000000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#eaeaea";
                  }}
                >
                  <span style={{ fontSize: "18px" }}>←</span>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}