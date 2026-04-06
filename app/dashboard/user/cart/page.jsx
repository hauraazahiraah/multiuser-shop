"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, loadCart, updateQuantity, removeFromCart, cartCount } = useCart();
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  
  const [savedNotes, setSavedNotes] = useState({});
  const [editingMode, setEditingMode] = useState({});
  const [tempNotes, setTempNotes] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const newTemp = {};
    const newSaved = {};
    const newEditing = {};
    cartItems.forEach(item => {
      newTemp[item.id] = tempNotes[item.id] || "";
      newSaved[item.id] = savedNotes[item.id] || "";
      if (editingMode[item.id] === undefined) {
        newEditing[item.id] = true;
      } else {
        newEditing[item.id] = editingMode[item.id];
      }
    });
    setTempNotes(newTemp);
    setSavedNotes(newSaved);
    setEditingMode(newEditing);
  }, [cartItems]);

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

  // 🔥 TAMBAHAN LOGIC STOCK
  const handleQuantityChange = async (cartId, currentQty, change) => {
    const item = cartItems.find(i => i.id === cartId);

    if (change > 0 && item?.product?.stock === 0) {
      alert("Produk ini sudah habis!");
      return;
    }

    const newQty = currentQty + change;
    if (newQty <= 0) {
      if (confirm("Remove item from cart?")) {
        await removeFromCart(cartId);
      }
    } else {
      await updateQuantity(cartId, newQty);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  const handleSaveNote = (itemId) => {
    setSavedNotes(prev => ({
      ...prev,
      [itemId]: tempNotes[itemId] || ""
    }));
    setEditingMode(prev => ({
      ...prev,
      [itemId]: false
    }));
  };

  const handleEditNote = (itemId) => {
    setTempNotes(prev => ({
      ...prev,
      [itemId]: savedNotes[itemId] || ""
    }));
    setEditingMode(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const handleTempNoteChange = (itemId, value) => {
    setTempNotes(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="header">
        <div className="header-left" onClick={() => router.push("/dashboard/user")}>
          <div className="logo">SS</div>
          <h1 className="brand">Serein Space</h1>
        </div>

        <nav className="main-nav">
          <button className="nav-link" onClick={() => router.push("/dashboard/user")}>
            Home
          </button>
          <button className="nav-link" onClick={() => router.push("/dashboard/user/products")}>
            Products
          </button>
          <button className="nav-link" onClick={() => router.push("/dashboard/user/history")}>
            Orders
          </button>
        </nav>

        <div className="header-right">
          <div className="cart-icon" onClick={() => router.push("/dashboard/user/cart")}>
            <span>🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>

          <button
            className="logout-btn"
            onMouseEnter={() => setIsHoveringLogout(true)}
            onMouseLeave={() => setIsHoveringLogout(false)}
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

          <div className="avatar">U</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => router.push("/dashboard/user")}>Dashboard</span>
            <span>/</span>
            <span className="current">Cart</span>
          </div>

          <h1 className="page-title">YOUR CART</h1>

          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any items yet</p>
              <button
                className="primary-btn"
                onClick={() => router.push("/dashboard/user/products")}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} />
                      ) : (
                        <span className="image-placeholder">🍽️</span>
                      )}
                    </div>

                    <div className="item-details">
                      <h4 className="item-name">{item.product.name}</h4>
                      <p className="item-category">{item.product.category}</p>
                      <p className="item-price">{formatRupiah(item.product.price)}</p>

                      {/* 🔥 WARNING */}
                      {item.product.stock === 0 && (
                        <div style={{
                          marginTop: "6px",
                          color: "red",
                          fontSize: "13px",
                          fontWeight: "600"
                        }}>
                          ⚠️ Maaf produk ini sudah habis
                        </div>
                      )}

                      {savedNotes[item.id] && !editingMode[item.id] && (
                        <div className="saved-note-display">
                          📝 <strong>Catatan:</strong> {savedNotes[item.id]}
                        </div>
                      )}
                    </div>

                    <div className="item-actions">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        >
                          −
                        </button>

                        <span className="qty-value">{item.quantity}</span>

                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          disabled={item.product.stock === 0}
                        >
                          +
                        </button>
                      </div>

                      <span className="item-subtotal">
                        {formatRupiah(item.product.price * item.quantity)}
                      </span>

                      <button
                        className="remove-btn"
                        onClick={() => {
                          if (confirm("Remove this item from cart?")) {
                            removeFromCart(item.id);
                          }
                        }}
                      >
                        <span>🗑️</span>
                        Remove
                      </button>
                    </div>

                    {editingMode[item.id] ? (
                      <div className="item-note">
                        <label className="note-label">📝 Edit / Tambah Catatan</label>
                        <div className="note-input-wrapper">
                          <textarea
                            className="note-input"
                            rows="2"
                            value={tempNotes[item.id] || ""}
                            onChange={(e) => handleTempNoteChange(item.id, e.target.value)}
                          />
                          <button
                            className="save-note-btn"
                            onClick={() => handleSaveNote(item.id)}
                          >
                            💾 Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      savedNotes[item.id] && (
                        <div className="edit-note-wrapper">
                          <button
                            className="edit-note-btn"
                            onClick={() => handleEditNote(item.id)}
                          >
                            ✏️ Edit Catatan
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>

              <div className="checkout-card">
                <div className="total-section">
                  <p className="total-label">Total Price</p>
                  <h2 className="total-value">{formatRupiah(total)}</h2>
                </div>

                {/* 🔥 FIX CHECKOUT */}
                <button
                  className="checkout-btn"
                  onClick={() => {
                    const hasOutOfStock = cartItems.some(item => item.product.stock === 0);

                    if (hasOutOfStock) {
                      alert("Ada produk yang sudah habis, hapus dulu dari keranjang!");
                      return;
                    }

                    router.push("/dashboard/user/checkout");
                  }}
                >
                  Checkout
                </button>
              </div>

              <div className="continue-shopping">
                <button
                  className="continue-btn"
                  onClick={() => router.push("/dashboard/user/products")}
                >
                  <span>←</span> Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-left">
          <span>© 2026 Serein Space. All rights reserved.</span>
          <span>v1.0.0</span>
        </div>
        <div className="footer-right">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help</span>
        </div>
      </footer>

      <style jsx>{`
        .cart-page {
          min-height: 100vh;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .header {
          background: #fff;
          border-bottom: 2px solid #000;
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .logo {
          width: 44px;
          height: 44px;
          background: #000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 20px;
        }
        .brand {
          font-size: 20px;
          font-weight: 800;
          color: #000;
          margin: 0;
        }
        .main-nav {
          display: flex;
          gap: 8px;
          background: #f5f5f5;
          padding: 4px;
          border-radius: 40px;
          border: 1px solid #000;
        }
        .nav-link {
          padding: 10px 24px;
          background: transparent;
          color: #000;
          border: none;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
        }
        .nav-link:hover {
          background: #eaeaea;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .cart-icon {
          position: relative;
          padding: 10px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 10px;
          cursor: pointer;
          font-size: 20px;
        }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #000;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: transparent;
          color: #000;
          border: 2px solid #000;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: #000;
          color: #fff;
        }
        .avatar {
          width: 40px;
          height: 40px;
          background: #000;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
        }

        /* MAIN CONTENT */
        .content {
          flex: 1;
          padding: 40px 32px;
          background: #fafafa;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #666;
        }
        .breadcrumb .current {
          color: #000;
          font-weight: 700;
        }
        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        /* Cart Items */
        .cart-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .cart-items {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          overflow: hidden;
        }
        .cart-item {
          display: flex;
          flex-wrap: wrap;
          padding: 24px;
          gap: 24px;
          align-items: flex-start;
        }
        .cart-item:not(:last-child) {
          border-bottom: 1px solid #000;
        }
        .item-image {
          width: 100px;
          height: 100px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .image-placeholder {
          font-size: 40px;
        }
        .item-details {
          flex: 1;
          min-width: 150px;
        }
        .item-name {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 4px;
        }
        .item-category {
          font-size: 14px;
          color: #666;
          margin: 0 0 8px;
        }
        .item-price {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }
        .saved-note-display {
          margin-top: 8px;
          font-size: 13px;
          background: #f0f0f0;
          padding: 6px 10px;
          border-radius: 6px;
          color: #000;
          border-left: 3px solid #000;
        }
        .item-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .quantity-control {
          display: flex;
          align-items: center;
          border: 2px solid #000;
          border-radius: 8px;
          overflow: hidden;
        }
        .qty-btn {
          width: 36px;
          height: 36px;
          background: #fff;
          border: none;
          border-right: 2px solid #000;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
        }
        .qty-btn:last-child {
          border-right: none;
          border-left: 2px solid #000;
        }
        .qty-value {
          width: 50px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-subtotal {
          font-size: 18px;
          font-weight: 800;
          min-width: 120px;
          text-align: right;
        }
        .remove-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          background: transparent;
          border: 2px solid #000;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .remove-btn:hover {
          background: #000;
          color: #fff;
        }

        /* Kolom komentar + save */
        .item-note {
          width: 100%;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px dashed #ccc;
        }
        .note-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .note-input-wrapper {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .note-input {
          flex: 1;
          padding: 10px 12px;
          font-size: 14px;
          font-family: inherit;
          border: 1px solid #000;
          border-radius: 8px;
          resize: vertical;
        }
        .save-note-btn {
          padding: 10px 20px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .save-note-btn:hover {
          background: #333;
        }
        .edit-note-wrapper {
          width: 100%;
          margin-top: 12px;
          text-align: right;
        }
        .edit-note-btn {
          padding: 6px 16px;
          background: transparent;
          border: 1px solid #000;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .edit-note-btn:hover {
          background: #f0f0f0;
        }

        /* Checkout Card */
        .checkout-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .total-label {
          font-size: 14px;
          color: #666;
          margin: 0 0 4px;
          text-transform: uppercase;
        }
        .total-value {
          font-size: 28px;
          font-weight: 800;
          margin: 0;
        }
        .checkout-btn {
          padding: 16px 48px;
          background: #000;
          color: #fff;
          border: 2px solid #000;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
        }
        .checkout-btn:hover {
          background: #333;
        }
        .continue-shopping {
          margin-top: 16px;
        }
        .continue-btn {
          padding: 12px 24px;
          background: transparent;
          border: 2px solid #000;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .continue-btn:hover {
          background: #000;
          color: #fff;
        }

        /* FOOTER */
        .footer {
          background: #fff;
          border-top: 2px solid #000;
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #666;
        }
        .footer-left, .footer-right {
          display: flex;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .header { flex-wrap: wrap; }
          .main-nav { order: 3; width: 100%; justify-content: center; }
          .cart-item { flex-direction: column; align-items: flex-start; }
          .item-actions { width: 100%; justify-content: space-between; }
          .checkout-card { flex-direction: column; text-align: center; gap: 16px; }
          .note-input-wrapper { flex-direction: column; }
          .save-note-btn { align-self: flex-start; }
          .edit-note-wrapper { text-align: left; }
        }
      `}</style>
    </div>
  );
}