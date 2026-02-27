"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { use } from "react"; // untuk unwrap params Promise!
import { signOut } from "next-auth/react";

const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function OrderDetailPage({ params }) {
  const { orderNumber } = use(params);
  const router = useRouter();
  const { loadCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          loadCart();
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) fetchOrder();
  }, [orderNumber, loadCart]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat detail pesanan...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #eaeaea;
            border-top: 4px solid #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          p {
            color: #666;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-page">
        <Header
          router={router}
          cartCount={0}
          handleLogout={handleLogout}
          isHoveringLogout={isHoveringLogout}
          setIsHoveringLogout={setIsHoveringLogout}
        />
        <main className="content">
          <div className="container">
            <div className="error-card">
              <div className="error-icon">🔍</div>
              <h1>Pesanan Tidak Ditemukan</h1>
              <p>Maaf, pesanan dengan nomor <strong>{orderNumber}</strong> tidak dapat ditemukan.</p>
              <button className="primary-btn" onClick={() => router.push("/dashboard/user")}>
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .error-page {
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
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            max-width: 500px;
            width: 100%;
          }
          .error-card {
            background: #fff;
            border: 2px solid #000;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
          }
          .error-icon {
            font-size: 64px;
            margin-bottom: 24px;
          }
          .error-card h1 {
            font-size: 24px;
            font-weight: 800;
            color: #000;
            margin: 0 0 16px;
          }
          .error-card p {
            font-size: 16px;
            color: #666;
            margin: 0 0 24px;
            font-weight: 500;
          }
          .primary-btn {
            padding: 14px 32px;
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

  // Fungsi untuk mendapatkan badge status
  const getPaymentStatusBadge = (status) => {
    const styles = {
      PENDING: { bg: "#fff", color: "#000", text: "PENDING", border: true },
      WAITING_PAYMENT: { bg: "#fff", color: "#000", text: "WAITING PAYMENT", border: true },
      PAID: { bg: "#000", color: "#fff", text: "PAID", border: false },
      FAILED: { bg: "#fff", color: "#000", text: "FAILED", border: true },
    };
    const s = styles[status] || { bg: "#f5f5f5", color: "#404040", text: status, border: false };
    return (
      <span
        style={{
          display: "inline-block",
          padding: "4px 12px",
          background: s.bg,
          color: s.color,
          border: s.border ? "2px solid #000" : "none",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {s.text}
      </span>
    );
  };

  // Komponen barcode sederhana (simulasi)
  const Barcode = () => (
    <div style={{ display: "flex", justifyContent: "center", gap: "2px", margin: "16px 0" }}>
      {[4, 2, 3, 5, 2, 4, 3, 2, 4, 6, 2, 3, 4, 2, 5, 3, 2, 4].map((width, i) => (
        <div
          key={i}
          style={{
            width: `${width}px`,
            height: "40px",
            background: i % 2 === 0 ? "#000" : "#fff",
            borderLeft: i % 2 === 0 ? "none" : "1px solid #000",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="receipt-page">
      <Header
        router={router}
        cartCount={0}
        handleLogout={handleLogout}
        isHoveringLogout={isHoveringLogout}
        setIsHoveringLogout={setIsHoveringLogout}
      />

      <main className="content">
        <div className="container">
          {/* Struk Card */}
          <div className="receipt-card">
            {/* Header Struk */}
            <div className="receipt-header">
              <div className="store-name">SEREIN SPACE</div>
              <div className="store-sub">Food & Beverage</div>
              <div className="receipt-divider">===============================</div>
            </div>

            {/* Nomor Order & Status */}
            <div className="receipt-row">
              <span className="receipt-label">Order No.</span>
              <span className="receipt-value monospace">{order.orderNumber}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Status</span>
              <span>{getPaymentStatusBadge(order.paymentStatus)}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Tanggal</span>
              <span className="receipt-value">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="receipt-divider">===============================</div>

            {/* Customer Info */}
            <div className="receipt-section">
              <div className="receipt-row">
                <span className="receipt-label">Nama</span>
                <span className="receipt-value">{order.customerName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Telepon</span>
                <span className="receipt-value">{order.customerPhone}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Alamat</span>
                <span className="receipt-value" style={{ maxWidth: "250px", textAlign: "right" }}>
                  {order.customerAddress}
                </span>
              </div>
            </div>

            <div className="receipt-divider">===============================</div>

            {/* Items */}
            <div className="receipt-items">
              <div className="items-header">
                <span>Item</span>
                <span>Qty</span>
                <span>Subtotal</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-qty">{item.quantity}</span>
                  <span className="item-subtotal">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="receipt-divider">===============================</div>

            {/* Total */}
            <div className="receipt-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="total-row">
                <span>Ongkir ({order.shippingMethod})</span>
                <span>{formatRupiah(order.shippingCost)}</span>
              </div>
              <div className="grand-total">
                <span>TOTAL</span>
                <span className="grand-amount">{formatRupiah(order.total)}</span>
              </div>
            </div>

            <div className="receipt-divider">===============================</div>

            {/* Payment Method */}
            <div className="receipt-payment">
              <div className="payment-row">
                <span>Metode Pembayaran</span>
                <span className="payment-value">{order.paymentMethod}</span>
              </div>
            </div>

            {/* Barcode (simulasi) */}
            <Barcode />

            {/* Footer Struk */}
            <div className="receipt-footer">
              <p>Terima kasih telah berbelanja di Serein Space</p>
              <p className="receipt-copy">* Dokumen ini sah tanpa tanda tangan *</p>
            </div>

            {/* Tombol Aksi */}
            <div className="receipt-actions">
              <button className="print-btn" onClick={() => window.print()}>
                🖨️ Cetak / Download
              </button>
              <button className="back-btn" onClick={() => router.push("/dashboard/user")}>
                ← Kembali
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .receipt-page {
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
          max-width: 600px;
          margin: 0 auto;
        }

        .receipt-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          font-family: 'Courier New', Courier, monospace;
        }

        .receipt-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .store-name {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .store-sub {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .receipt-divider {
          text-align: center;
          font-size: 14px;
          letter-spacing: -1px;
          margin: 16px 0;
          color: #000;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .receipt-label {
          font-weight: 600;
          color: #000;
        }

        .receipt-value {
          font-weight: 500;
          color: #333;
        }

        .monospace {
          font-family: 'Courier New', monospace;
          font-weight: 700;
        }

        .receipt-section {
          margin-bottom: 16px;
        }

        .receipt-items {
          margin: 16px 0;
        }

        .items-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 13px;
          border-bottom: 1px dashed #000;
          padding-bottom: 8px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .item-name {
          flex: 2;
        }

        .item-qty {
          flex: 0.5;
          text-align: center;
        }

        .item-subtotal {
          flex: 1;
          text-align: right;
          font-weight: 600;
        }

        .receipt-total {
          margin: 16px 0;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .grand-total {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: 800;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 2px solid #000;
        }

        .grand-amount {
          font-size: 20px;
        }

        .receipt-payment {
          margin: 16px 0;
          padding: 12px;
          background: #f5f5f5;
          border: 1px dashed #000;
        }

        .payment-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
        }

        .payment-value {
          text-transform: uppercase;
        }

        .receipt-footer {
          text-align: center;
          margin: 24px 0 16px;
          font-size: 12px;
          color: #666;
        }

        .receipt-copy {
          font-size: 11px;
          color: #999;
          margin-top: 4px;
        }

        .receipt-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .print-btn, .back-btn {
          flex: 1;
          padding: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: 2px solid #000;
          border-radius: 8px;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .print-btn {
          background: #000;
          color: #fff;
        }

        .print-btn:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .back-btn {
          background: #fff;
          color: #000;
        }

        .back-btn:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        @media (max-width: 480px) {
          .content {
            padding: 20px 16px;
          }
          .receipt-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

// Header Component (sama seperti di halaman user lainnya)
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
          letter-spacing: 1px;
        }
        .brand {
          font-size: 20px;
          font-weight: 800;
          color: #000;
          margin: 0;
          letter-spacing: -0.3px;
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
          letter-spacing: 0.5px;
        }
        .nav-link:hover {
          background: #eaeaea;
        }
        .nav-link.active {
          background: #000;
          color: #fff;
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
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
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
          font-size: 16px;
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