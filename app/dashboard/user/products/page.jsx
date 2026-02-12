"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number || 0);
};

export default function UserProducts() {
  const router = useRouter();
  const { addToCart, cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/product");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    const result = await addToCart(productId, 1);
    setAddingId(null);
    
    if (!result.success) {
      alert(result.error || "Failed to add to cart");
    }
  };

  // Group products by category
  const categories = products.reduce((acc, product) => {
    const category = product.category || "Lainnya";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "#6b6b6b" }}>Loading products...</p>
        </div>
      </div>
    );
  }

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
              Our Menu
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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
            <span style={{ color: "#000000", fontWeight: 500 }}>Products</span>
          </div>

          {/* Page Title */}
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#000000",
                margin: 0,
                marginBottom: "8px",
                letterSpacing: "-0.5px",
              }}
            >
              Our Menu
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#6b6b6b",
                margin: 0,
              }}
            >
              {products.length} delicious items available
            </p>
          </div>

          {/* Products Grid by Category */}
          {products.length > 0 ? (
            Object.keys(categories).map((category) => (
              <div key={category} style={{ marginBottom: "48px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
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
                    {category}
                  </h3>
                  <span
                    style={{
                      padding: "6px 16px",
                      backgroundColor: "#eaeaea",
                      borderRadius: "20px",
                      fontSize: "13px",
                      color: "#404040",
                    }}
                  >
                    {categories[category].length} items
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {categories[category].map((product) => (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #eaeaea",
                        borderRadius: "12px",
                        overflow: "hidden",
                        transition: "all 0.2s",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
                        e.currentTarget.style.borderColor = "#000000";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                        e.currentTarget.style.borderColor = "#eaeaea";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Image Container */}
                      <div
                        style={{
                          width: "100%",
                          height: "180px",
                          backgroundColor: "#fafafa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderBottom: "1px solid #eaeaea",
                        }}
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "48px", color: "#cccccc" }}>🍽️</span>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <h4
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#000000",
                              margin: 0,
                              marginBottom: "4px",
                            }}
                          >
                            {product.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "18px",
                              fontWeight: 700,
                              color: "#000000",
                              margin: 0,
                            }}
                          >
                            {formatRupiah(product.price)}
                          </p>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                          <span
                            style={{
                              padding: "4px 12px",
                              backgroundColor: "#f5f5f5",
                              borderRadius: "20px",
                              fontSize: "12px",
                              color: "#404040",
                              display: "inline-block",
                            }}
                          >
                            Stock: {product.stock}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingId === product.id}
                          style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: addingId === product.id ? "#8c8c8c" : "#000000",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: addingId === product.id ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            marginTop: "auto",
                          }}
                          onMouseEnter={(e) => {
                            if (addingId !== product.id) {
                              e.currentTarget.style.backgroundColor = "#333333";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (addingId !== product.id) {
                              e.currentTarget.style.backgroundColor = "#000000";
                            }
                          }}
                        >
                          <span>{addingId === product.id ? "Adding..." : "Add to Cart"}</span>
                          <span style={{ fontSize: "16px" }}>+</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 40px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #eaeaea",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "24px" }}>🍽️</div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                No products available
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b6b6b",
                  margin: 0,
                }}
              >
                Check back later for our delicious menu
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}