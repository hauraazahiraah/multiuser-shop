"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function AdminHome() {
  const router = useRouter();
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  // MOCK DATA
  const stats = {
    totalOrders: 156,
    totalRevenue: 45600000,
    totalProducts: 24,
    totalCustomers: 89,
    pendingOrders: 12,
    completedOrders: 144,
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <div className="admin-home">
      {/* HEADER with Navigation */}
      <header className="header">
        <div className="header-left" onClick={() => router.push("/dashboard/admin")}>
          <div className="logo">SS</div>
          <h1 className="brand">Serein Space</h1>
        </div>

        <nav className="main-nav">
          <button
            className="nav-link active"
            onClick={() => router.push("/dashboard/admin")}
          >
            Dashboard
          </button>
          <button
            className="nav-link"
            onClick={() => router.push("/dashboard/admin/products")}
          >
            Products
          </button>
          <button
            className="nav-link"
            onClick={() => router.push("/dashboard/admin/orders")}
          >
            Orders Report
          </button>
        </nav>

        <div className="header-right">
          {/* Profile */}
          <div
            className="profile-btn"
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
            onClick={() => router.push("/dashboard/admin/profile")}
          >
            <div className="avatar">A</div>
            {isHoveringProfile && (
              <div className="profile-info">
                <p className="profile-name">Admin User</p>
                <p className="profile-email">admin@serein.space</p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            className="logout-btn"
            onMouseEnter={() => setIsHoveringLogout(true)}
            onMouseLeave={() => setIsHoveringLogout(false)}
            onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="content">
        {/* Welcome */}
        <section className="welcome-card">
          <h2 className="welcome-title">
            Welcome back, <span className="welcome-badge">Admin</span>
          </h2>
          <p className="welcome-sub">Here's what's happening with your business today.</p>
        </section>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard
            icon="📦"
            label="Total Orders"
            value={stats.totalOrders}
            sublabel={`${stats.completedOrders} completed`}
          />
          <StatCard
            icon="💰"
            label="Total Revenue"
            value={formatRupiah(stats.totalRevenue)}
            sublabel="This month"
          />
          <StatCard
            icon="🍽️"
            label="Total Products"
            value={stats.totalProducts}
            sublabel="Active items"
          />
          <StatCard
            icon="👥"
            label="Total Customers"
            value={stats.totalCustomers}
            sublabel="Registered users"
          />
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Sales Overview</h3>
            <div className="chart-placeholder">📊 Chart akan muncul di sini</div>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Order Status</h3>
            <div className="status-bars">
              <StatusBar
                label="Completed"
                value={stats.completedOrders}
                total={stats.totalOrders}
                color="#000"
              />
              <StatusBar
                label="Pending"
                value={stats.pendingOrders}
                total={stats.totalOrders}
                color="#666"
              />
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
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
        .admin-home {
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

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 12px;
          border-radius: 30px;
          cursor: pointer;
          transition: background 0.2s;
          border: 1px solid transparent;
        }

        .profile-btn:hover {
          background: #f5f5f5;
          border-color: #000;
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: #000;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
        }

        .profile-info {
          margin-right: 4px;
        }

        .profile-name {
          font-size: 14px;
          font-weight: 700;
          margin: 0;
          color: #000;
        }

        .profile-email {
          font-size: 12px;
          color: #666;
          margin: 2px 0 0;
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

        /* MAIN CONTENT */
        .content {
          flex: 1;
          padding: 32px;
          background: #fafafa;
        }

        .welcome-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .welcome-badge {
          background: #000;
          color: #fff;
          padding: 4px 12px;
          border-radius: 8px;
          font-weight: 700;
        }

        .welcome-sub {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 24px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 700;
          color: #000;
          margin: 0 0 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chart-placeholder {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 12px;
          color: #666;
          font-weight: 500;
        }

        .status-bars {
          display: flex;
          flex-direction: column;
          gap: 16px;
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

        .footer-left, .footer-right {
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
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
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
          .header-right {
            margin-left: auto;
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .footer {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .footer-left, .footer-right {
            flex-wrap: wrap;
            justify-content: center;
          }
          .profile-info {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// StatCard Component
const StatCard = ({ icon, label, value, sublabel }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="stat-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff',
        border: hover ? '2px solid #000' : '2px solid #000',
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.2s',
        cursor: 'pointer',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? '0 8px 20px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px', fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ fontSize: '28px', fontWeight: 800, color: '#000', margin: '0 0 4px' }}>
        {value}
      </p>
      {sublabel && (
        <p style={{ fontSize: '12px', color: '#666', margin: 0, fontWeight: 500 }}>
          {sublabel}
        </p>
      )}
    </div>
  );
};

// StatusBar Component
const StatusBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#000' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color }}>{value}</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          background: '#eaeaea',
          border: '1px solid #000',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            borderRadius: '4px',
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  );
};