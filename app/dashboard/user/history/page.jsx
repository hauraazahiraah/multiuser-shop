"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function UserHistoryPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "U";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/user");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getPaymentStatus = (status) => {
    switch (status) {
      case "PAID":
        return { text: "LUNAS", color: "#2e7d32", bg: "#e8f5e9" };
      case "CANCELLED":
        return { text: "BATAL", color: "#c62828", bg: "#ffebee" };
      default:
        return { text: "PENDING", color: "#e65100", bg: "#fff3e0" };
    }
  };

  const getDeliveryStatus = (status) => {
    switch (status) {
      case "SHIPPED":
        return { text: "🚚 SEDANG DIANTAR", color: "#1565c0", bg: "#e3f2fd" };
      case "DELIVERED":
        return { text: "✅ PESANAN DITERIMA", color: "#2e7d32", bg: "#e8f5e9" };
      case "PICKED_UP":
        return { text: "🏪 DIAMBIL PEMBELI", color: "#6a1b9a", bg: "#f3e5f5" };
      default:
        return { text: "⏳ MENUNGGU", color: "#e65100", bg: "#fff3e0" };
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", background: "#fff", minHeight: "100vh" }}>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* HEADER SAMA PERSIS DENGAN PRODUCTS */}
      <header style={{
        background: "#fff",
        borderBottom: "2px solid #000",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => router.push("/dashboard/user")}>
          <div style={{
            width: "44px",
            height: "44px",
            background: "#000",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: "20px"
          }}>SS</div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#000", margin: 0 }}>Serein Space</h1>
        </div>

        <nav style={{ display: "flex", gap: "8px", background: "#f5f5f5", padding: "4px", borderRadius: "40px", border: "1px solid #000" }}>
          <button style={{ padding: "10px 24px", background: "transparent", border: "none", borderRadius: "30px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }} onClick={() => router.push("/dashboard/user")}>Home</button>
          <button style={{ padding: "10px 24px", background: "transparent", border: "none", borderRadius: "30px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }} onClick={() => router.push("/dashboard/user/products")}>Products</button>
          <button style={{ padding: "10px 24px", background: "#000", color: "#fff", border: "none", borderRadius: "30px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }} onClick={() => router.push("/dashboard/user/history")}>Orders</button>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", padding: "10px", background: "#f5f5f5", border: "1px solid #000", borderRadius: "10px", cursor: "pointer" }} onClick={() => router.push("/dashboard/user/cart")}>
            <span>🛒</span>
            {cartCount > 0 && <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#000", color: "#fff", fontSize: "10px", fontWeight: 700, width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </div>

          <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "transparent", border: "2px solid #000", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }} onMouseEnter={() => setIsHoveringLogout(true)} onMouseLeave={() => setIsHoveringLogout(false)} onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </button>

          <div style={{ position: "relative" }} onMouseEnter={() => setIsHoveringProfile(true)} onMouseLeave={() => setIsHoveringProfile(false)}>
            <div style={{ width: "40px", height: "40px", background: "#000", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{userInitial}</div>
            {isHoveringProfile && (
              <div style={{ position: "absolute", top: "50px", right: 0, background: "#fff", border: "2px solid #000", borderRadius: "12px", padding: "12px 16px", minWidth: "180px", zIndex: 100 }}>
                <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{userName}</p>
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#000", margin: "0 0 8px", letterSpacing: "-0.5px" }}>ORDER HISTORY</h1>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>Your past transactions</p>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", border: "2px solid #000", borderRadius: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>No orders yet</h3>
            <p style={{ color: "#888", marginBottom: "24px" }}>Start shopping to see your orders here</p>
            <button style={{ padding: "12px 24px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }} onClick={() => router.push("/dashboard/user/products")}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {orders.map((order) => {
              const payment = getPaymentStatus(order.paymentStatus);
              const delivery = getDeliveryStatus(order.deliveryStatus);
              return (
                <div key={order.id} style={{ border: "2px solid #000", borderRadius: "16px", padding: "20px", background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#999", letterSpacing: "0.5px", marginBottom: "4px" }}>ORDER NUMBER</div>
                      <div style={{ fontWeight: 700, fontSize: "16px", fontFamily: "monospace" }}>{order.orderNumber}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{formatDate(order.createdAt)}</div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#999", marginBottom: "4px" }}>TOTAL</div>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#000" }}>Rp {formatRupiah(order.total)}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#999", marginBottom: "4px" }}>STATUS PEMBAYARAN</div>
                      <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, background: payment.bg, color: payment.color }}>{payment.text}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#999", marginBottom: "4px" }}>STATUS PENGIRIMAN</div>
                      <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, background: delivery.bg, color: delivery.color }}>{delivery.text}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #eee", paddingTop: "16px" }}>
                    <Link href={`/dashboard/user/order/${order.orderNumber}`} style={{ fontSize: "13px", fontWeight: 600, color: "#000", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      VIEW DETAILS →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ background: "#fff", borderTop: "2px solid #000", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#666", marginTop: "40px" }}>
        <div>© 2026 Serein Space. All rights reserved. v1.0.0</div>
        <div style={{ display: "flex", gap: "24px" }}>
          <span style={{ cursor: "pointer" }}>Privacy Policy</span>
          <span style={{ cursor: "pointer" }}>Terms of Service</span>
          <span style={{ cursor: "pointer" }}>Help</span>
        </div>
      </footer>
    </div>
  );
}