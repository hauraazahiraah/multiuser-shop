"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          // Mock data fallback
          setOrders([
            {
              id: 1,
              orderNumber: "INV-20260212-099",
              customerName: "user21",
              customerEmail: "user21@gmail.com",
              total: 105000,
              paymentStatus: "WAITING_PAYMENT",
              paymentMethod: "TRANSFER",
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              orderNumber: "INV-20260212-170",
              customerName: "user21",
              customerEmail: "user21@gmail.com",
              total: 130000,
              paymentStatus: "WAITING_PAYMENT",
              paymentMethod: "TRANSFER",
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    if (filter === "pending") return order.paymentStatus === "PENDING" || order.paymentStatus === "WAITING_PAYMENT";
    if (filter === "paid") return order.paymentStatus === "PAID";
    return true;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder = filteredOrders.length ? Math.round(totalRevenue / filteredOrders.length) : 0;

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* SIDEBAR */}
      <div style={{ 
        width: 280, 
        backgroundColor: "#fff", 
        borderRight: "1px solid #eaeaea", 
        padding: 24,
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            backgroundColor: "#000", 
            borderRadius: 12, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "#fff", 
            fontSize: 22 
          }}>
            🍜
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>FoodieDash</h2>
            <p style={{ fontSize: 12, color: "#6b6b6b", margin: "4px 0 0" }}>Admin Dashboard</p>
          </div>
        </div>

        {/* Menu */}
        <div style={{ flex: 1 }}>
          <p style={{ 
            fontSize: 11, 
            fontWeight: 600, 
            color: "#8c8c8c", 
            textTransform: "uppercase", 
            letterSpacing: "0.5px", 
            marginBottom: 16 
          }}>
            Main Menu
          </p>
          
          <div 
            onClick={() => router.push("/dashboard/admin")}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              padding: "12px 16px", 
              borderRadius: 10, 
              marginBottom: 4, 
              cursor: "pointer",
              color: "#404040",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#404040";
            }}
          >
            <span style={{ marginRight: 12, fontSize: 20 }}>📊</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Dashboard</span>
          </div>

          <div 
            onClick={() => router.push("/dashboard/admin/products")}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              padding: "12px 16px", 
              borderRadius: 10, 
              marginBottom: 4, 
              cursor: "pointer",
              color: "#404040",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#404040";
            }}
          >
            <span style={{ marginRight: 12, fontSize: 20 }}>🍽️</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Products</span>
          </div>

          <div 
            onClick={() => router.push("/dashboard/admin/orders")}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              padding: "12px 16px", 
              backgroundColor: "#f5f5f5",
              borderRadius: 10, 
              marginBottom: 4, 
              cursor: "pointer",
              color: "#000",
              fontWeight: 600
            }}
          >
            <span style={{ marginRight: 12, fontSize: 20 }}>📋</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Orders Report</span>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ 
          borderTop: "1px solid #eaeaea", 
          paddingTop: 24, 
          marginTop: "auto" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ 
              width: 44, 
              height: 44, 
              backgroundColor: "#eaeaea", 
              borderRadius: 12, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#404040",
              fontWeight: 600,
              fontSize: 18
            }}>
              A
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Admin User</p>
              <p style={{ fontSize: 12, color: "#6b6b6b", margin: "4px 0 0" }}>admin@foodie.com</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}
            style={{ 
              width: "100%", 
              padding: "10px", 
              backgroundColor: "transparent", 
              border: "1px solid #eaeaea", 
              borderRadius: 8, 
              fontSize: 13,
              fontWeight: 500,
              color: "#404040",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
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
            <span style={{ fontSize: 16 }}>🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: 40, backgroundColor: "#f5f5f5" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: "#000", 
            margin: 0, 
            marginBottom: 8,
            letterSpacing: "-0.5px"
          }}>
            Orders Report
          </h1>
          <p style={{ fontSize: 16, color: "#6b6b6b", margin: 0 }}>
            All transactions from all customers
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 20, 
          marginBottom: 32 
        }}>
          <div style={{ 
            backgroundColor: "#fff", 
            padding: 24, 
            borderRadius: 16, 
            border: "1px solid #eaeaea",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
          }}>
            <p style={{ fontSize: 14, color: "#8c8c8c", marginBottom: 8 }}>Total Orders</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#000", margin: 0 }}>
              {filteredOrders.length}
            </p>
          </div>
          <div style={{ 
            backgroundColor: "#fff", 
            padding: 24, 
            borderRadius: 16, 
            border: "1px solid #eaeaea",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
          }}>
            <p style={{ fontSize: 14, color: "#8c8c8c", marginBottom: 8 }}>Total Revenue</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#000", margin: 0 }}>
              {formatRupiah(totalRevenue)}
            </p>
          </div>
          <div style={{ 
            backgroundColor: "#fff", 
            padding: 24, 
            borderRadius: 16, 
            border: "1px solid #eaeaea",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
          }}>
            <p style={{ fontSize: 14, color: "#8c8c8c", marginBottom: 8 }}>Average Order</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#000", margin: 0 }}>
              {formatRupiah(avgOrder)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "8px 24px",
              backgroundColor: filter === "all" ? "#000" : "#fff",
              color: filter === "all" ? "#fff" : "#404040",
              border: "1px solid #eaeaea",
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilter("pending")}
            style={{
              padding: "8px 24px",
              backgroundColor: filter === "pending" ? "#000" : "#fff",
              color: filter === "pending" ? "#fff" : "#404040",
              border: "1px solid #eaeaea",
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("paid")}
            style={{
              padding: "8px 24px",
              backgroundColor: filter === "paid" ? "#000" : "#fff",
              color: filter === "paid" ? "#fff" : "#404040",
              border: "1px solid #eaeaea",
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Paid
          </button>
        </div>

        {/* Orders Table */}
        <div style={{ 
          backgroundColor: "#fff", 
          borderRadius: 16, 
          border: "1px solid #eaeaea",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #eaeaea" }}>
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, color: "#8c8c8c", fontWeight: 600 }}>Order ID</th>
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, color: "#8c8c8c", fontWeight: 600 }}>Customer</th>
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, color: "#8c8c8c", fontWeight: 600 }}>Date</th>
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, color: "#8c8c8c", fontWeight: 600 }}>Total</th>
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, color: "#8c8c8c", fontWeight: 600 }}>Payment</th>
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, color: "#8c8c8c", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  style={{ 
                    borderBottom: "1px solid #eaeaea",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  {/* ✅ ORDER NUMBER - FIX MIRING! */}
                  <td style={{ 
                    padding: "16px 20px", 
                    fontFamily: "'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace",
                    fontSize: 13,
                    fontStyle: "normal",
                    fontWeight: 500,
                    letterSpacing: "0.3px",
                    color: "#000"
                  }}>
                    {order.orderNumber}
                  </td>
                  
                  {/* CUSTOMER */}
                  <td style={{ padding: "16px 20px" }}>
                    <div>
                      <p style={{ 
                        fontSize: 14, 
                        fontWeight: 600, 
                        margin: 0, 
                        marginBottom: 4,
                        fontStyle: "normal",
                        color: "#000"
                      }}>
                        {order.customerName}
                      </p>
                      <p style={{ 
                        fontSize: 12, 
                        color: "#6b6b6b", 
                        margin: 0,
                        fontStyle: "normal"
                      }}>
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>
                  
                  {/* DATE */}
                  <td style={{ 
                    padding: "16px 20px", 
                    fontSize: 13, 
                    color: "#6b6b6b",
                    fontStyle: "normal"
                  }}>
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric"
                    })}
                  </td>
                  
                  {/* TOTAL */}
                  <td style={{ 
                    padding: "16px 20px", 
                    fontSize: 14, 
                    fontWeight: 600,
                    fontStyle: "normal",
                    color: "#000"
                  }}>
                    {formatRupiah(order.total)}
                  </td>
                  
                  {/* PAYMENT METHOD */}
                  <td style={{ 
                    padding: "16px 20px", 
                    fontSize: 13, 
                    color: "#6b6b6b",
                    fontStyle: "normal"
                  }}>
                    {order.paymentMethod}
                  </td>
                  
                  {/* STATUS */}
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      backgroundColor: order.paymentStatus === "PAID" ? "#f6ffed" : "#fff7e6",
                      color: order.paymentStatus === "PAID" ? "#389e0d" : "#d48806",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      fontStyle: "normal",
                      letterSpacing: "0.3px"
                    }}>
                      {order.paymentStatus === "PAID" ? "PAID" : "PENDING"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}