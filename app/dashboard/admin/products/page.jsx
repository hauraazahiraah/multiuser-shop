"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Edit Product State
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("Makanan");
  const [editStock, setEditStock] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const formatRp = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/product");
      if (!res.ok) return;
      setProducts(await res.json());
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================= ADD =================
  const add = async () => {
    if (!name || !price || !stock) {
      alert("Name, price, and stock are required");
      return;
    }

    setIsAdding(true);
    try {
      let imageUrl = "";

      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const up = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const r = await up.json();
        imageUrl = r.url;
      }

      await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseInt(price),
          imageUrl,
          category,
          stock: parseInt(stock),
        }),
      });

      setName("");
      setPrice("");
      setCategory("Makanan");
      setStock("");
      setFile(null);

      load();
    } catch (error) {
      alert("Failed to add product");
    } finally {
      setIsAdding(false);
    }
  };

  // ================= DELETE =================
  const del = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      load();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  // ================= EDIT =================
  const openEdit = (p) => {
    setEditId(p.id);
    setEditName(p.name || "");
    setEditPrice(p.price?.toString() || "");
    setEditCategory(p.category || "Makanan");
    setEditStock(p.stock?.toString() || "");
    setEditFile(null);
  };

  const saveEdit = async () => {
    if (!editName || !editPrice || !editStock) {
      alert("Name, price, and stock are required");
      return;
    }

    setIsEditing(true);
    try {
      let imageUrl = undefined;

      if (editFile) {
        const fd = new FormData();
        fd.append("file", editFile);

        const up = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const r = await up.json();
        imageUrl = r.url;
      }

      await fetch(`/api/product/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          price: parseInt(editPrice),
          category: editCategory,
          stock: parseInt(editStock),
          ...(imageUrl && { imageUrl }),
        }),
      });

      setEditId(null);
      load();
    } catch (error) {
      alert("Failed to update product");
    } finally {
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditFile(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
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
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/dashboard/admin")}
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
              Product Management
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
          <button
            onClick={() => router.push("/dashboard/admin")}
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
            ← Back to Dashboard
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
            A
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
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
              Manage Products
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#6b6b6b",
                margin: 0,
              }}
            >
              Add, edit, and remove food items from your menu
            </p>
          </div>

          {/* Add Product Form */}
          <div
            style={{
              backgroundColor: "#fafafa",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "48px",
              border: "1px solid #eaeaea",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#000000",
                margin: 0,
                marginBottom: "24px",
              }}
            >
              Add New Product
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#404040",
                    marginBottom: "8px",
                  }}
                >
                  Product Name *
                </label>
                <input
                  placeholder="e.g. Nasi Goreng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    border: "1px solid #eaeaea",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#000000")}
                  onBlur={(e) => (e.target.style.borderColor = "#eaeaea")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#404040",
                    marginBottom: "8px",
                  }}
                >
                  Price (IDR) *
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    border: "1px solid #eaeaea",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#000000")}
                  onBlur={(e) => (e.target.style.borderColor = "#eaeaea")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#404040",
                    marginBottom: "8px",
                  }}
                >
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    border: "1px solid #eaeaea",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    outline: "none",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    backgroundSize: "16px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#000000")}
                  onBlur={(e) => (e.target.style.borderColor = "#eaeaea")}
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Snack">Snack</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#404040",
                    marginBottom: "8px",
                  }}
                >
                  Stock *
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    border: "1px solid #eaeaea",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#000000")}
                  onBlur={(e) => (e.target.style.borderColor = "#eaeaea")}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#404040",
                    marginBottom: "8px",
                  }}
                >
                  Product Image
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <label
                    htmlFor="file-upload"
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#ffffff",
                      color: "#404040",
                      border: "1px solid #eaeaea",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                      e.currentTarget.style.borderColor = "#000000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "#eaeaea";
                    }}
                  >
                    Choose File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      color: file ? "#000000" : "#8c8c8c",
                    }}
                  >
                    {file ? file.name : "No file chosen"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "32px" }}>
              <button
                onClick={add}
                disabled={isAdding}
                style={{
                  padding: "12px 32px",
                  backgroundColor: isAdding ? "#8c8c8c" : "#000000",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: isAdding ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!isAdding) e.currentTarget.style.backgroundColor = "#333333";
                }}
                onMouseLeave={(e) => {
                  if (!isAdding) e.currentTarget.style.backgroundColor = "#000000";
                }}
              >
                {isAdding ? "Adding..." : "Add Product"}
                <span style={{ fontSize: "18px" }}>+</span>
              </button>
            </div>
          </div>

          {/* Products List */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                }}
              >
                All Products
              </h3>
              <span
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "20px",
                  fontSize: "13px",
                  color: "#404040",
                }}
              >
                {products.length} items
              </span>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px",
                  backgroundColor: "#fafafa",
                  borderRadius: "16px",
                  border: "1px solid #eaeaea",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
                <p style={{ color: "#6b6b6b", margin: 0 }}>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px",
                  backgroundColor: "#fafafa",
                  borderRadius: "16px",
                  border: "1px solid #eaeaea",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#000000",
                    margin: "0 0 8px 0",
                  }}
                >
                  No products yet
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b6b6b",
                    margin: 0,
                  }}
                >
                  Add your first product to get started
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                {products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #eaeaea",
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                      e.currentTarget.style.borderColor = "#000000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#eaeaea";
                    }}
                  >
                    {p.imageUrl && (
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
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {editId === p.id ? (
                      <div style={{ padding: "20px" }}>
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ fontSize: "12px", color: "#6b6b6b", display: "block", marginBottom: "4px" }}>
                            Name
                          </label>
                          <input
                            value={editName || ""}
                            onChange={(e) => setEditName(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              fontSize: "14px",
                              border: "1px solid #eaeaea",
                              borderRadius: "6px",
                              marginBottom: "12px",
                            }}
                          />
                          
                          <label style={{ fontSize: "12px", color: "#6b6b6b", display: "block", marginBottom: "4px" }}>
                            Price
                          </label>
                          <input
                            type="number"
                            value={editPrice?.toString() || ""}
                            onChange={(e) => setEditPrice(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              fontSize: "14px",
                              border: "1px solid #eaeaea",
                              borderRadius: "6px",
                              marginBottom: "12px",
                            }}
                          />

                          <label style={{ fontSize: "12px", color: "#6b6b6b", display: "block", marginBottom: "4px" }}>
                            Category
                          </label>
                          <select
                            value={editCategory || "Makanan"}
                            onChange={(e) => setEditCategory(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              fontSize: "14px",
                              border: "1px solid #eaeaea",
                              borderRadius: "6px",
                              marginBottom: "12px",
                              appearance: "none",
                              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 12px center",
                              backgroundSize: "14px",
                            }}
                          >
                            <option value="Makanan">Makanan</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Snack">Snack</option>
                            <option value="Dessert">Dessert</option>
                          </select>

                          <label style={{ fontSize: "12px", color: "#6b6b6b", display: "block", marginBottom: "4px" }}>
                            Stock
                          </label>
                          <input
                            type="number"
                            value={editStock?.toString() || ""}
                            onChange={(e) => setEditStock(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              fontSize: "14px",
                              border: "1px solid #eaeaea",
                              borderRadius: "6px",
                              marginBottom: "16px",
                            }}
                          />

                          <label style={{ fontSize: "12px", color: "#6b6b6b", display: "block", marginBottom: "4px" }}>
                            New Image (optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditFile(e.target.files[0])}
                            style={{
                              width: "100%",
                              fontSize: "13px",
                              marginBottom: "16px",
                            }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={saveEdit}
                            disabled={isEditing}
                            style={{
                              flex: 1,
                              padding: "10px",
                              backgroundColor: isEditing ? "#8c8c8c" : "#000000",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: 500,
                              cursor: isEditing ? "not-allowed" : "pointer",
                            }}
                          >
                            {isEditing ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{
                              padding: "10px 16px",
                              backgroundColor: "#ffffff",
                              color: "#404040",
                              border: "1px solid #eaeaea",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "20px" }}>
                        <div style={{ marginBottom: "16px" }}>
                          <h4
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#000000",
                              margin: 0,
                              marginBottom: "8px",
                            }}
                          >
                            {p.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "18px",
                              fontWeight: 700,
                              color: "#000000",
                              margin: 0,
                              marginBottom: "8px",
                            }}
                          >
                            {formatRp(p.price)}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            {/* ✅ FALLBACK UNTUK CATEGORY - TAMBAHAN */}
                            <span
                              style={{
                                padding: "4px 10px",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 500,
                                color: "#404040",
                              }}
                            >
                              {p.category || "Makanan"}
                            </span>
                            {/* ✅ FALLBACK UNTUK STOCK - TAMBAHAN */}
                            <span
                              style={{
                                padding: "4px 10px",
                                backgroundColor: (p.stock || 0) > 10 ? "#f5f5f5" : "#fff1f0",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 500,
                                color: (p.stock || 0) > 10 ? "#404040" : "#cf1322",
                              }}
                            >
                              Stock: {p.stock ?? 0}
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            borderTop: "1px solid #eaeaea",
                            paddingTop: "16px",
                          }}
                        >
                          <button
                            onClick={() => openEdit(p)}
                            style={{
                              flex: 1,
                              padding: "8px",
                              backgroundColor: "#ffffff",
                              color: "#404040",
                              border: "1px solid #eaeaea",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#f5f5f5";
                              e.currentTarget.style.borderColor = "#000000";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#ffffff";
                              e.currentTarget.style.borderColor = "#eaeaea";
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => del(p.id)}
                            style={{
                              flex: 1,
                              padding: "8px",
                              backgroundColor: "#ffffff",
                              color: "#cf1322",
                              border: "1px solid #ffccc7",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#fff1f0";
                              e.currentTarget.style.borderColor = "#ff4d4f";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#ffffff";
                              e.currentTarget.style.borderColor = "#ffccc7";
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid #eaeaea",
          padding: "24px 40px",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#8c8c8c",
              }}
            >
              © 2024 FoodieDash. All rights reserved.
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#8c8c8c",
              }}
            >
              v1.0.0
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#8c8c8c",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8c8c8c")}
            >
              Privacy Policy
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#8c8c8c",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8c8c8c")}
            >
              Terms of Service
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#8c8c8c",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8c8c8c")}
            >
              Help
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}