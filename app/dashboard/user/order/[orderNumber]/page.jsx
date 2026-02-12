"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { use } from "react"; // ✅ WAJIB: untuk unwrap params Promise!

const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function OrderDetailPage({ params }) {
  // ✅ Next.js 15 Client Component: params adalah Promise, harus di-unwrap!
  const { orderNumber } = use(params);

  const router = useRouter();
  const { loadCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
        <p>Memuat detail pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>Pesanan tidak ditemukan</h1>
        <button
          onClick={() => router.push("/dashboard/user")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#000000",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            marginTop: 16,
            cursor: "pointer",
          }}
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const getPaymentStatusBadge = (status) => {
    const styles = {
      PENDING: { bg: "#fff7e6", color: "#d48806", text: "Menunggu Konfirmasi" },
      WAITING_PAYMENT: { bg: "#e6f7ff", color: "#096dd9", text: "Menunggu Pembayaran" },
      PAID: { bg: "#f6ffed", color: "#389e0d", text: "Sudah Dibayar" },
      FAILED: { bg: "#fff1f0", color: "#cf1322", text: "Gagal" },
    };
    const s = styles[status] || { bg: "#f5f5f5", color: "#404040", text: status };
    return (
      <span
        style={{
          display: "inline-block",
          padding: "4px 12px",
          background: s.bg,
          color: s.color,
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {s.text}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
      {/* HEADER STRUK */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧾</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Pesanan Berhasil Dibuat!
        </h1>
        <p style={{ fontSize: 16, color: "#6b6b6b" }}>
          Terima kasih sudah berbelanja di FoodieDash
        </p>
      </div>

      {/* CARD INVOICE */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #eaeaea",
          padding: 32,
          boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
        }}
      >
        {/* NOMOR ORDER & STATUS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <p style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>
              No. Pesanan
            </p>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "monospace",
                margin: 0,
              }}
            >
              {order.orderNumber}
            </h2>
          </div>
          {getPaymentStatusBadge(order.paymentStatus)}
        </div>

        {/* INFORMASI PELANGGAN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 32,
            padding: 24,
            background: "#fafafa",
            borderRadius: 12,
          }}
        >
          <div>
            <p style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 8 }}>
              DATA PENERIMA
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>
              {order.customerName}
            </p>
            <p style={{ fontSize: 14, color: "#404040", margin: "0 0 4px" }}>
              {order.customerPhone}
            </p>
            <p style={{ fontSize: 14, color: "#404040", margin: 0 }}>
              {order.customerEmail || "-"}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 8 }}>
              ALAMAT PENGIRIMAN
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#404040",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {order.customerAddress}
            </p>
          </div>
        </div>

        {/* DETAIL PRODUK */}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          Detail Produk
        </h3>
        <div style={{ marginBottom: 24 }}>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom:
                  idx < order.items.length - 1 ? "1px solid #eaeaea" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "#f5f5f5",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt=""
                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                    />
                  ) : (
                    <span>🍽️</span>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
                    {item.product.name}
                  </p>
                  <p style={{ fontSize: 13, color: "#6b6b6b", margin: "4px 0 0" }}>
                    {item.quantity} x {formatRupiah(item.price)}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
                {formatRupiah(item.subtotal)}
              </p>
            </div>
          ))}
        </div>

        {/* RINCIAN BIAYA */}
        <div style={{ borderTop: "1px solid #eaeaea", paddingTop: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#6b6b6b" }}>Subtotal</span>
            <span style={{ fontWeight: 500 }}>{formatRupiah(order.subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#6b6b6b" }}>Ongkos Kirim ({order.shippingMethod})</span>
            <span style={{ fontWeight: 500 }}>{formatRupiah(order.shippingCost)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
              paddingTop: 16,
              borderTop: "2px solid #eaeaea",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700 }}>Total Pembayaran</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>
              {formatRupiah(order.total)}
            </span>
          </div>
        </div>

        {/* INFO PEMBAYARAN */}
        <div
          style={{
            background: "#fafafa",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h4
            style={{
              fontSize: 15,
              fontWeight: 600,
              margin: "0 0 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>💳</span> Metode Pembayaran
          </h4>
          <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>
            {order.paymentMethod}
          </p>

          {order.paymentMethod === "TRANSFER" && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: "#fff",
                borderRadius: 8,
                border: "1px solid #eaeaea",
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                INSTRUKSI PEMBAYARAN:
              </p>
              <p style={{ fontSize: 13, margin: "0 0 4px" }}>
                🏦 Bank BCA: 1234567890 a.n. FoodieDash
              </p>
              <p style={{ fontSize: 13, margin: "0 0 4px" }}>
                🏦 Bank Mandiri: 1234567890 a.n. FoodieDash
              </p>
              <p style={{ fontSize: 13, margin: 0, color: "#cf1322" }}>
                Upload bukti transfer di halaman ini
              </p>
            </div>
          )}

          {order.paymentMethod === "COD" && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: "#fff",
                borderRadius: 8,
                border: "1px solid #eaeaea",
              }}
            >
              <p style={{ fontSize: 13, margin: 0 }}>
                ✅ Siapkan uang pas sebesar{" "}
                <strong>{formatRupiah(order.total)}</strong> saat kurir tiba.
              </p>
            </div>
          )}
        </div>

        {/* TOMBOL AKSI */}
        <div style={{ display: "flex", gap: 16 }}>
          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#000000",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            🖨️ Cetak / Download Struk
          </button>
          <button
            onClick={() => router.push("/dashboard/user")}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "transparent",
              color: "#404040",
              border: "1px solid #eaeaea",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}