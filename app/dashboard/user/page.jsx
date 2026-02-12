"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { signOut } from "next-auth/react"; // ✅ IMPORT NEXTAUTH LOGOUT!

// FORMAT RUPIAH - SUDAH DITAMBAHKAN!
const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function UserHome() {
  const router = useRouter();
  const [isHoveringProducts, setIsHoveringProducts] = useState(false);
  const [isHoveringHistory, setIsHoveringHistory] = useState(false);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const { cartCount } = useCart();

  // Mock data untuk rekomendasi
  const recommendedItems = [
    { id: 1, name: "Nasi Goreng", category: "Makanan", price: 35000, image: "🍚" },
    { id: 2, name: "Es Teh", category: "Minuman", price: 5000, image: "🧋" },
    { id: 3, name: "Ayam Bakar", category: "Makanan", price: 45000, image: "🍗" },
    { id: 4, name: "Pisang Goreng", category: "Snack", price: 15000, image: "🍌" },
  ];

  const categories = [
    { id: 1, name: "Makanan", icon: "🍽️", count: 24 },
    { id: 2, name: "Minuman", icon: "🥤", count: 18 },
    { id: 3, name: "Snack", icon: "🍪", count: 12 },
    { id: 4, name: "Dessert", icon: "🍰", count: 8 },
  ];

  // ✅ LOGOUT PAKAI NEXTAUTH!
  const handleLogout = async () => {
    await signOut({ 
      redirect: true, 
      callbackUrl: "/auth/login" 
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: "flex",
        flexDirection: "column",
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
              Welcome back, User!
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
          
          {/* Logout Button - PAKAI NEXTAUTH! */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => setIsHoveringLogout(true)}
            onMouseLeave={() => setIsHoveringLogout(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: isHoveringLogout ? "#fff1f0" : "transparent",
              color: isHoveringLogout ? "#cf1322" : "#404040",
              border: isHoveringLogout ? "1px solid #ffccc7" : "1px solid #eaeaea",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "16px" }}>🚪</span>
            Logout
          </button>

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
      <main style={{ flex: 1, padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Hero Section */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "40px",
              marginBottom: "40px",
              border: "1px solid #eaeaea",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ maxWidth: "500px" }}>
              <h2
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#000000",
                  margin: 0,
                  marginBottom: "16px",
                  letterSpacing: "-1px",
                  lineHeight: 1.2,
                }}
              >
                Welcome back,{" "}
                <span style={{ backgroundColor: "#000000", color: "#ffffff", padding: "0 8px", borderRadius: "4px" }}>
                  User
                </span>
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b6b6b",
                  margin: 0,
                  marginBottom: "32px",
                  lineHeight: 1.6,
                }}
              >
                Ready to satisfy your cravings? Check out our delicious menu with fresh ingredients and authentic flavors.
              </p>
              <button
                onClick={() => router.push("/dashboard/user/products")}
                onMouseEnter={() => setIsHoveringProducts(true)}
                onMouseLeave={() => setIsHoveringProducts(false)}
                style={{
                  padding: "14px 32px",
                  backgroundColor: isHoveringProducts ? "#333333" : "#000000",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: isHoveringProducts ? "0 8px 20px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Browse Menu
                <span style={{ fontSize: "20px", transform: isHoveringProducts ? "translateX(4px)" : "none", transition: "transform 0.2s" }}>
                  →
                </span>
              </button>
            </div>
            <div
              style={{
                fontSize: "100px",
                opacity: 0.8,
              }}
            >
              🍳
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                }}
              >
                Browse Categories
              </h3>
              <span
                style={{
                  fontSize: "14px",
                  color: "#6b6b6b",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/dashboard/user/products")}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b6b")}
              >
                View all →
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    padding: "24px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #eaeaea",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  }}
                  onClick={() => router.push("/dashboard/user/products")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#000000";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#eaeaea";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>{cat.icon}</div>
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#000000",
                      margin: 0,
                      marginBottom: "4px",
                    }}
                  >
                    {cat.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#8c8c8c",
                      margin: 0,
                    }}
                  >
                    {cat.count} items
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
              marginBottom: "48px",
            }}
          >
            {/* Browse Menu Card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #eaeaea",
                borderRadius: "16px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => router.push("/dashboard/user/products")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#000000";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
                setIsHoveringProducts(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#eaeaea";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                setIsHoveringProducts(false);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                  }}
                >
                  🍽️
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "18px", fontWeight: 600, margin: 0, marginBottom: "4px" }}>
                    Browse Menu
                  </h4>
                  <p style={{ fontSize: "14px", color: "#6b6b6b", margin: 0 }}>
                    Jelajahi menu makanan kami
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "24px",
                    color: isHoveringProducts ? "#000000" : "#8c8c8c",
                    transition: "transform 0.2s",
                    transform: isHoveringProducts ? "translateX(8px)" : "none",
                  }}
                >
                  →
                </span>
              </div>
            </div>

            {/* Order History Card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #eaeaea",
                borderRadius: "16px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => router.push("/dashboard/user/history")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#000000";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
                setIsHoveringHistory(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#eaeaea";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                setIsHoveringHistory(false);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                  }}
                >
                  📋
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "18px", fontWeight: 600, margin: 0, marginBottom: "4px" }}>
                    Order History
                  </h4>
                  <p style={{ fontSize: "14px", color: "#6b6b6b", margin: 0 }}>
                    Lihat riwayat pesananmu
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "24px",
                    color: isHoveringHistory ? "#000000" : "#8c8c8c",
                    transition: "transform 0.2s",
                    transform: isHoveringHistory ? "translateX(8px)" : "none",
                  }}
                >
                  →
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Items */}
          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#000000",
                    margin: 0,
                    marginBottom: "4px",
                  }}
                >
                  Recommended for You
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b6b6b",
                    margin: 0,
                  }}
                >
                  Based on your previous orders
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard/user/products")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "transparent",
                  color: "#404040",
                  border: "1px solid #eaeaea",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
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
                See All
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              {recommendedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #eaeaea",
                    borderRadius: "12px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  }}
                  onClick={() => router.push("/dashboard/user/products")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#000000";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#eaeaea";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "140px",
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "48px",
                      marginBottom: "12px",
                    }}
                  >
                    {item.image}
                  </div>
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#000000",
                      margin: 0,
                      marginBottom: "4px",
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#8c8c8c",
                      margin: 0,
                      marginBottom: "12px",
                    }}
                  >
                    {item.category}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#000000",
                      }}
                    >
                      {formatRupiah(item.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000000")}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Banner */}
          <div
            style={{
              backgroundColor: "#000000",
              borderRadius: "16px",
              padding: "32px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#ffffff",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  marginBottom: "12px",
                  display: "inline-block",
                }}
              >
                Limited Time Offer
              </span>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                Free Delivery on First Order
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.8)",
                  margin: 0,
                }}
              >
                Use code: WELCOME20
              </p>
            </div>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Order Now →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}