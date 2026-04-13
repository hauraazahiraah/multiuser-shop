"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { signOut } from "next-auth/react";

const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, loadCart, cartCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);

  // Shipping options untuk cafe
  const shippingOptions = {
    "Delivery Reguler": { label: "Delivery (30-60 menit)", cost: 10000 },
    "Delivery Express": { label: "Delivery Express (15-30 menit)", cost: 20000 },
    "Pickup": { label: "Ambil di Toko (20 menit)", cost: 0 },
  };

  // Form data pelanggan
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shippingMethod: "Delivery Reguler",
    paymentMethod: "TRANSFER",
  });

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost = shippingOptions[formData.shippingMethod]?.cost || 0;
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.phone || !formData.address) {
    alert("Nama, nomor HP, dan alamat wajib diisi!");
    return;
  }

  if (!formData.email) {
    alert("Email wajib diisi!");
    return;
  }

  if (!formData.paymentMethod) {
    alert("Pilih metode pembayaran!");
    return;
  }

  if (cartItems.length === 0) {
    alert("Keranjang belanja kosong!");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        shippingMethod: formData.shippingMethod,
        shippingCost: shippingCost,
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      await clearCart();
      // ✅ LANGSUNG REDIRECT KE STRUK
      router.push(`/dashboard/user/order/${data.order.orderNumber}`);
    } else {
      alert(data.error || "Checkout gagal");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Terjadi kesalahan saat checkout");
  } finally {
    setLoading(false);
  }
};

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <Header
          router={router}
          cartCount={cartCount}
          handleLogout={handleLogout}
          isHoveringLogout={isHoveringLogout}
          setIsHoveringLogout={setIsHoveringLogout}
        />
        <main className="content">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Start shopping to checkout</p>
              <button
                className="primary-btn"
                onClick={() => router.push("/dashboard/user/products")}
              >
                Browse Products
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .checkout-page {
            min-height: 100vh;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
          }
          .content {
            flex: 1;
            padding: 40px 32px;
            background: #fafafa;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .empty-state {
            background: #fff;
            border: 2px solid #000;
            border-radius: 20px;
            padding: 60px 40px;
            text-align: center;
          }
          .empty-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }
          .empty-state h3 {
            font-size: 18px;
            font-weight: 700;
            color: #000;
            margin: 0 0 8px;
          }
          .empty-state p {
            font-size: 14px;
            color: #666;
            margin: 0 0 24px;
            font-weight: 500;
          }
          .primary-btn {
            padding: 12px 32px;
            background: #000;
            color: #fff;
            border: 2px solid #000;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .primary-btn:hover {
            background: #333;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header
        router={router}
        cartCount={cartCount}
        handleLogout={handleLogout}
        isHoveringLogout={isHoveringLogout}
        setIsHoveringLogout={setIsHoveringLogout}
      />

      <main className="content">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => router.push("/dashboard/user")}>Dashboard</span>
            <span>/</span>
            <span onClick={() => router.push("/dashboard/user/cart")}>Cart</span>
            <span>/</span>
            <span className="current">Checkout</span>
          </div>

          <h1 className="page-title">CHECKOUT</h1>

          <div className="checkout-grid">
            {/* FORM DATA PELANGGAN */}
            <div className="form-section">
              <h3 className="section-title">1. Data Penerima</h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Nama Lengkap <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    No. WhatsApp <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="081234567890"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Alamat Lengkap <span className="required">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                    rows={3}
                    className="form-textarea"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Metode Pengiriman</label>
                  <select
                    name="shippingMethod"
                    value={formData.shippingMethod}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {Object.entries(shippingOptions).map(([key, opt]) => (
                      <option key={key} value={key}>
                        {opt.label} - {formatRupiah(opt.cost)}
                      </option>
                    ))}
                  </select>
                </div>

                <h3 className="section-title">2. Metode Pembayaran</h3>

                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="TRANSFER"
                      checked={formData.paymentMethod === "TRANSFER"}
                      onChange={handleInputChange}
                    />
                    <div>
                      <strong>Transfer Bank (BCA/Mandiri/BRI)</strong>
                      <p>Bayar via virtual account atau transfer manual</p>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="EWALLET"
                      checked={formData.paymentMethod === "EWALLET"}
                      onChange={handleInputChange}
                    />
                    <div>
                      <strong>E-Wallet (OVO/GoPay/DANA)</strong>
                      <p>Bayar pakai dompet digital</p>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleInputChange}
                    />
                    <div>
                      <strong>Cash on Delivery (COD)</strong>
                      <p>Bayar tunai saat barang sampai</p>
                    </div>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Memproses..." : "Buat Pesanan"}
                  </button>
                </div>
              </form>
            </div>

            {/* SIDEBAR - RINGKASAN ORDER */}
            <div className="sidebar">
              <div className="summary-card">
                <h3 className="section-title">Ringkasan Belanja</h3>

                <div className="items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div className="item-image">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} />
                        ) : (
                          <span>🍽️</span>
                        )}
                      </div>
                      <div className="item-details">
                        <p className="item-name">{item.product.name}</p>
                        <p className="item-qty">
                          {item.quantity} x {formatRupiah(item.product.price)}
                        </p>
                      </div>
                      <p className="item-subtotal">
                        {formatRupiah(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="total-row">
                    <span>Ongkos Kirim</span>
                    <span>{formatRupiah(shippingCost)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                </div>

                <button
                  className="back-btn"
                  onClick={() => router.push("/dashboard/user/cart")}
                >
                  ← Kembali ke Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .content {
          flex: 1;
          padding: 40px 32px;
          background: #fafafa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .breadcrumb span {
          cursor: pointer;
          transition: color 0.2s;
        }

        .breadcrumb span:hover {
          color: #000;
        }

        .breadcrumb .current {
          color: #000;
          font-weight: 700;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          margin-bottom: 32px;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 32px;
        }

        .form-section {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 32px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #000;
          margin: 0 0 24px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #000;
          padding-bottom: 12px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #000;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .required {
          color: #000;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #000;
          border-radius: 8px;
          font-size: 15px;
          background: #fff;
          color: #000;
          outline: none;
          box-sizing: border-box;
          font-weight: 500;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          border-color: #333;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }

        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 2px solid #000;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .payment-option:hover {
          background: #f5f5f5;
        }

        .payment-option input[type="radio"] {
          width: 18px;
          height: 18px;
          accent-color: #000;
        }

        .payment-option strong {
          font-size: 15px;
          font-weight: 700;
          color: #000;
        }

        .payment-option p {
          font-size: 13px;
          color: #666;
          margin: 4px 0 0;
          font-weight: 500;
        }

        .form-actions {
          margin-top: 32px;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #000;
          color: #fff;
          border: 2px solid #000;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .submit-btn:disabled {
          background: #999;
          border-color: #999;
          cursor: not-allowed;
        }

        .sidebar {
          position: sticky;
          top: 100px;
          align-self: start;
        }

        .summary-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 32px;
        }

        .items-list {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 20px;
        }

        .summary-item {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 16px;
        }

        .item-image {
          width: 50px;
          height: 50px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-size: 14px;
          font-weight: 700;
          color: #000;
          margin: 0 0 4px;
        }

        .item-qty {
          font-size: 12px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .item-subtotal {
          font-size: 14px;
          font-weight: 700;
          color: #000;
          white-space: nowrap;
        }

        .summary-totals {
          border-top: 1px solid #000;
          padding-top: 16px;
          margin-bottom: 24px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .total-row.grand-total {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #000;
          font-size: 18px;
          font-weight: 800;
          color: #000;
        }

        .back-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          color: #000;
          border: 2px solid #000;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .back-btn:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        @media (max-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
          .sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .content {
            padding: 20px;
          }
          .form-section {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

// Header Component
function Header({ router, cartCount, handleLogout, isHoveringLogout, setIsHoveringLogout }) {
  return (
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

      <style jsx>{`
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
          transition: all 0.2s;
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
          transition: all 0.2s;
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
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .header {
            flex-wrap: wrap;
            gap: 16px;
          }
          .main-nav {
            order: 3;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
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
      <style jsx>{`
        .footer {
          background: #fff;
          border-top: 2px solid #000;
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }
        .footer-left,
        .footer-right {
          display: flex;
          gap: 24px;
        }
        .footer-right span {
          cursor: pointer;
          transition: color 0.2s;
        }
        .footer-right span:hover {
          color: #000;
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .footer {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .footer-left,
          .footer-right {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}