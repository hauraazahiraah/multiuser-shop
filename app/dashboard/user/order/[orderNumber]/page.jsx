"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { signOut } from "next-auth/react";

export default function OrderDetailPage() {
  const { orderNumber } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "U";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (orderNumber) fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/order/${orderNumber}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PAID": return "LUNAS ✅";
      case "CANCELLED": return "BATAL ❌";
      default: return "PENDING ⏳";
    }
  };

  const getDeliveryText = (status) => {
    switch (status) {
      case "SHIPPED": return "🚚 SEDANG DIANTAR";
      case "DELIVERED": return "✅ PESANAN DITERIMA";
      case "PICKED_UP": return "🏪 DIAMBIL PEMBELI";
      default: return "⏳ MENUNGGU";
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <p>Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h3>Order not found</h3>
        <p>{error}</p>
        <Link href="/dashboard/user/history">← Back to Orders</Link>
      </div>
    );
  }

  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const total = order.total || subtotal + (order.shippingCost || 0);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* HEADER */}
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
          <div style={{ width: "44px", height: "44px", background: "#000", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "20px" }}>SS</div>
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
          <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "transparent", border: "2px solid #000", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }} onClick={handleLogout}>🚪 Logout</button>
          <div style={{ width: "40px", height: "40px", background: "#000", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>{userInitial}</div>
        </div>
      </header>

      {/* STRUK */}
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ border: "2px solid #000", borderRadius: "16px", padding: "32px", background: "#fff" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", margin: "0 0 8px" }}>SEREIN SPACE</h2>
            <p style={{ fontSize: "12px", color: "#666", margin: "4px 0" }}>Jl. Coffee No. 123, Jakarta</p>
            <p style={{ fontSize: "12px", color: "#666", margin: "4px 0" }}>Tel: (021) 1234-5678</p>
          </div>

          <div style={{ borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd", padding: "16px 0", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Order #</span>
              <strong>{order.orderNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Date</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Status Pembayaran</span>
              <span style={{ fontWeight: "bold", color: order.paymentStatus === "PAID" ? "#2e7d32" : "#e65100" }}>
                {getStatusText(order.paymentStatus)}
              </span>
            </div>
            {/* ✅ TAMBAHAN STATUS PENGIRIMAN */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Status Pengiriman</span>
              <span style={{ fontWeight: "bold", color: "#1565c0" }}>
                {getDeliveryText(order.deliveryStatus)}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", fontWeight: "bold", marginBottom: "12px", fontSize: "12px" }}>
              <span>ITEM</span><span>QTY</span><span>PRICE</span><span>SUBTOTAL</span>
            </div>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", marginBottom: "8px", fontSize: "14px" }}>
                <span>{item.product?.name}</span>
                <span>{item.quantity}</span>
                <span>Rp {formatCurrency(item.price)}</span>
                <span>Rp {formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #ddd", paddingTop: "16px", textAlign: "right" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Subtotal</span>
              <span>Rp {formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Shipping</span>
              <span>Rp {formatCurrency(order.shippingCost || 0)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "18px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #ddd" }}>
              <span>TOTAL</span>
              <span>Rp {formatCurrency(total)}</span>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #ddd" }}>
            <p>Thank you for shopping at Serein Space!</p>
            <p>🎉 Enjoy your coffee 🍴</p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button onClick={() => router.push("/dashboard/user/history")} style={{ padding: "10px 20px", background: "transparent", border: "2px solid #000", borderRadius: "8px", cursor: "pointer" }}>← Back to Orders</button>
        </div>
      </main>

      <footer style={{ background: "#fff", borderTop: "2px solid #000", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#666", marginTop: "40px" }}>
        <div>© 2026 Serein Space. All rights reserved. v1.0.0</div>
        <div style={{ display: "flex", gap: "24px" }}>Privacy | Terms | Help</div>
      </footer>
    </div>
  );
}