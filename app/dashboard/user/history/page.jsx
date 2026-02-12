"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/order/history");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Order History
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            No transactions yet
          </h3>
          <p style={{ fontSize: 16, color: "#6b6b6b", marginBottom: 24 }}>
            Start shopping to see your order history
          </p>
          <button
            onClick={() => router.push("/dashboard/user/products")}
            style={{
              padding: "12px 32px",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #eaeaea",
                borderRadius: 12,
                padding: 24,
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 12, color: "#8c8c8c" }}>Order Number</p>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>{order.orderNumber}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#8c8c8c" }}>Total</p>
                  <p style={{ fontSize: 18, fontWeight: 700 }}>
                    {formatRupiah(order.total)}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#6b6b6b", marginTop: 12 }}>
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}