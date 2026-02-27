"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function HistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/order/history");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        // Jika gagal, tetap set array kosong tanpa console error
        setOrders([]);
      }
    } catch (error) {
      // Tangkap error tapi tidak tampilkan di console
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading history...</p>
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

  return (
    <div className="history-page">
      {/* Header */}
      <header className="header">
        <div className="header-left" onClick={() => router.push("/dashboard/user")}>
          <div className="logo">SS</div>
          <h1 className="brand">Serein Space</h1>
        </div>

        <nav className="main-nav">
          <button
            className="nav-link"
            onClick={() => router.push("/dashboard/user")}
          >
            Home
          </button>
          <button
            className="nav-link"
            onClick={() => router.push("/dashboard/user/products")}
          >
            Products
          </button>
          <button
            className="nav-link active"
            onClick={() => router.push("/dashboard/user/history")}
          >
            Orders
          </button>
        </nav>

        <div className="header-right">
          {/* Logout Button */}
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
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => router.push("/dashboard/user")}>Dashboard</span>
            <span>/</span>
            <span className="current">Order History</span>
          </div>

          {/* Page Title */}
          <div className="page-header">
            <h2 className="page-title">ORDER HISTORY</h2>
            <p className="page-subtitle">Your past transactions</p>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No transactions yet</h3>
              <p>Start shopping to see your order history</p>
              <button
                className="primary-btn"
                onClick={() => router.push("/dashboard/user/products")}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-number">
                      <span className="label">Order Number</span>
                      <span className="value">{order.orderNumber}</span>
                    </div>
                    <div className="order-total">
                      <span className="label">Total</span>
                      <span className="value">{formatRupiah(order.total)}</span>
                    </div>
                  </div>
                  <div className="order-body">
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.paymentStatus?.toLowerCase()}`}>
                        {order.paymentStatus || "PENDING"}
                      </span>
                    </div>
                  </div>
                  <button
                    className="detail-btn"
                    onClick={() => router.push(`/dashboard/user/orders/${order.id}`)}
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
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
        .history-page {
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

        /* MAIN CONTENT */
        .content {
          flex: 1;
          padding: 40px 32px;
          background: #fafafa;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Breadcrumb */
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

        /* Page Header */
        .page-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }

        .page-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 40px;
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          color: #000;
          margin: 0 0 8px;
        }

        .empty-state p {
          font-size: 16px;
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

        /* Orders List */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s;
        }

        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #000;
        }

        .order-number, .order-total {
          display: flex;
          flex-direction: column;
        }

        .order-number .label, .order-total .label {
          font-size: 11px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .order-number .value {
          font-size: 16px;
          font-weight: 700;
          color: #000;
        }

        .order-total .value {
          font-size: 18px;
          font-weight: 800;
          color: #000;
        }

        .order-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .order-date {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          border: 2px solid #000;
        }

        .status-badge.paid {
          background: #000;
          color: #fff;
        }

        .status-badge.pending {
          background: #fff;
          color: #000;
        }

        .status-badge.cancelled {
          background: #fff;
          color: #000;
          border-color: #000;
        }

        .detail-btn {
          width: 100%;
          padding: 12px;
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

        .detail-btn:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        /* FOOTER */
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

        /* RESPONSIVE */
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

        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }
          .order-header {
            flex-direction: column;
            gap: 12px;
          }
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
    </div>
  );
}