"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function AdminHome() {
  const router = useRouter();
  const [isHoveringProducts, setIsHoveringProducts] = useState(false);
  const [isHoveringOrders, setIsHoveringOrders] = useState(false);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  // ✅ MOCK DATA - LANGSUNG MUNCUL!
  const stats = {
    totalOrders: 156,
    totalRevenue: 45600000,
    totalProducts: 24,
    totalCustomers: 89,
    pendingOrders: 12,
    completedOrders: 144,
  };

  const recentOrders = [
    { id: "INV-20260212-001", customer: "John Doe", total: 125000, status: "PAID", date: "12 Feb 2026" },
    { id: "INV-20260212-002", customer: "Jane Smith", total: 85000, status: "PENDING", date: "12 Feb 2026" },
    { id: "INV-20260212-003", customer: "Bob Johnson", total: 210000, status: "PAID", date: "11 Feb 2026" },
    { id: "INV-20260211-089", customer: "Alice Brown", total: 45000, status: "PAID", date: "11 Feb 2026" },
    { id: "INV-20260211-088", customer: "Charlie Wilson", total: 175000, status: "PENDING", date: "10 Feb 2026" },
  ];

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ✅ HEADER - STICKY ATAS */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #eaeaea",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: "#000000",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "22px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/dashboard/admin")}
          >
            🍜
          </div>
          <div>
            <h1
              style={{
                fontSize: "20px",
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
                fontSize: "13px",
                color: "#6b6b6b",
                margin: "4px 0 0 0",
              }}
            >
              Admin Dashboard
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Profile Avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "6px 12px",
              backgroundColor: isHoveringProfile ? "#f5f5f5" : "transparent",
              borderRadius: "30px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
            onClick={() => router.push("/dashboard/admin/profile")}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#000000",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              A
            </div>
            <div style={{ display: isHoveringProfile ? "block" : "none", marginRight: "4px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>Admin User</p>
              <p style={{ fontSize: "12px", color: "#6b6b6b", margin: "2px 0 0" }}>admin@foodie.com</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}
            onMouseEnter={() => setIsHoveringLogout(true)}
            onMouseLeave={() => setIsHoveringLogout(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: isHoveringLogout ? "#fff1f0" : "transparent",
              color: isHoveringLogout ? "#cf1322" : "#404040",
              border: "1px solid",
              borderColor: isHoveringLogout ? "#ffccc7" : "#eaeaea",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "18px" }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT - SIDEBAR + CONTENT */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <div
          style={{
            width: "280px",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #eaeaea",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {/* MENU */}
          <div style={{ padding: "24px", flex: 1 }}>
            <div style={{ marginBottom: "24px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#8c8c8c",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Main Menu
              </span>
            </div>

            {/* DASHBOARD */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#000000",
                color: "#ffffff",
                borderRadius: "12px",
                marginBottom: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ marginRight: "12px", fontSize: "20px" }}>📊</span>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Dashboard</span>
            </div>

            {/* PRODUCTS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                color: isHoveringProducts ? "#000000" : "#404040",
                backgroundColor: isHoveringProducts ? "#f5f5f5" : "transparent",
                borderRadius: "12px",
                marginBottom: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={() => setIsHoveringProducts(true)}
              onMouseLeave={() => setIsHoveringProducts(false)}
              onClick={() => router.push("/dashboard/admin/products")}
            >
              <span style={{ marginRight: "12px", fontSize: "20px" }}>🍽️</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Products</span>
            </div>

            {/* ORDERS REPORT */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                color: isHoveringOrders ? "#000000" : "#404040",
                backgroundColor: isHoveringOrders ? "#f5f5f5" : "transparent",
                borderRadius: "12px",
                marginBottom: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={() => setIsHoveringOrders(true)}
              onMouseLeave={() => setIsHoveringOrders(false)}
              onClick={() => router.push("/dashboard/admin/orders")}
            >
              <span style={{ marginRight: "12px", fontSize: "20px" }}>📋</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Orders Report</span>
            </div>
          </div>

          {/* SIDEBAR FOOTER */}
          <div
            style={{
              padding: "24px",
              borderTop: "1px solid #eaeaea",
              backgroundColor: "#fafafa",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#eaeaea",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#404040",
                  fontWeight: 600,
                  fontSize: "18px",
                }}
              >
                A
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, margin: 0, color: "#000" }}>
                  Admin User
                </p>
                <p style={{ fontSize: "12px", color: "#8c8c8c", margin: "4px 0 0" }}>
                  admin@foodie.com
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "transparent",
                color: "#404040",
                border: "1px solid #eaeaea",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fff1f0";
                e.currentTarget.style.color = "#cf1322";
                e.currentTarget.style.borderColor = "#ffccc7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#404040";
                e.currentTarget.style.borderColor = "#eaeaea";
              }}
            >
              <span style={{ fontSize: "16px" }}>🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <div
          style={{
            flex: 1,
            padding: "32px",
            backgroundColor: "#fafafa",
          }}
        >
          {/* WELCOME SECTION */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "32px",
              marginBottom: "32px",
              border: "1px solid #eaeaea",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
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
              Welcome back,{" "}
              <span
                style={{
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  padding: "4px 12px",
                  borderRadius: "8px",
                }}
              >
                Admin
              </span>
            </h2>
            <p style={{ fontSize: "16px", color: "#6b6b6b", margin: 0 }}>
              Here's what's happening with your food business today.
            </p>
          </div>

          {/* STATISTICS CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
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

          {/* CHARTS SECTION (BISA DIISI NANTI) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #eaeaea",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                  marginBottom: "16px",
                }}
              >
                Sales Overview
              </h3>
              <div
                style={{
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fafafa",
                  borderRadius: "12px",
                  color: "#8c8c8c",
                }}
              >
                📊 Chart akan muncul di sini
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #eaeaea",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                  marginBottom: "16px",
                }}
              >
                Order Status
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <StatusBar label="Completed" value={stats.completedOrders} total={stats.totalOrders} color="#389e0d" />
                <StatusBar label="Pending" value={stats.pendingOrders} total={stats.totalOrders} color="#d48806" />
              </div>
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid #eaeaea",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
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
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                }}
              >
                Recent Orders
              </h3>
              <button
                onClick={() => router.push("/dashboard/admin/orders")}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  color: "#404040",
                  backgroundColor: "transparent",
                  border: "1px solid #eaeaea",
                  borderRadius: "8px",
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
                View All →
              </button>
            </div>

            {/* ORDERS TABLE */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #eaeaea" }}>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontSize: "12px", color: "#8c8c8c", fontWeight: 600 }}>Order ID</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontSize: "12px", color: "#8c8c8c", fontWeight: 600 }}>Customer</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontSize: "12px", color: "#8c8c8c", fontWeight: 600 }}>Date</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontSize: "12px", color: "#8c8c8c", fontWeight: 600 }}>Total</th>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontSize: "12px", color: "#8c8c8c", fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: "1px solid #eaeaea",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td
                        style={{
                          padding: "12px 8px",
                          fontFamily: "'SF Mono', Monaco, Consolas, 'Courier New', monospace",
                          fontSize: "13px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          letterSpacing: "0.3px",
                          color: "#000",
                        }}
                      >
                        {order.id}
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: "14px", color: "#404040" }}>
                        {order.customer}
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: "13px", color: "#6b6b6b" }}>
                        {order.date}
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: "14px", fontWeight: 600, color: "#000" }}>
                        {formatRupiah(order.total)}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            backgroundColor: order.status === "PAID" ? "#f6ffed" : "#fff7e6",
                            color: order.status === "PAID" ? "#389e0d" : "#d48806",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 600,
                            fontStyle: "normal",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FOOTER */}
      <footer
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid #eaeaea",
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "13px",
          color: "#8c8c8c",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span>© 2024 FoodieDash. All rights reserved.</span>
          <span>v1.0.0</span>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <span style={{ cursor: "pointer" }}>Privacy Policy</span>
          <span style={{ cursor: "pointer" }}>Terms of Service</span>
          <span style={{ cursor: "pointer" }}>Help</span>
        </div>
      </footer>
    </div>
  );
}

// ✅ COMPONENT STAT CARD
const StatCard = ({ icon, label, value, sublabel }) => (
  <div
    style={{
      backgroundColor: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: "16px",
      padding: "24px",
      transition: "all 0.2s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
      e.currentTarget.style.borderColor = "#000000";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#eaeaea";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div style={{ fontSize: "32px", marginBottom: "12px" }}>{icon}</div>
    <p style={{ fontSize: "14px", color: "#8c8c8c", margin: 0, marginBottom: "8px" }}>
      {label}
    </p>
    <p style={{ fontSize: "28px", fontWeight: 700, color: "#000000", margin: 0, marginBottom: "4px" }}>
      {value}
    </p>
    {sublabel && (
      <p style={{ fontSize: "12px", color: "#8c8c8c", margin: 0 }}>
        {sublabel}
      </p>
    )}
  </div>
);

// ✅ COMPONENT STATUS BAR
const StatusBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: "#404040" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 600, color }}>{value}</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "4px",
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
};