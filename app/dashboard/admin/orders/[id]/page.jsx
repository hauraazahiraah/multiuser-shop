"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const updatePaymentStatus = async (newStatus) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: newStatus }),
    });
    if (res.ok) {
      fetchOrder();
      alert("Status pembayaran berhasil diubah!");
    } else {
      alert("Gagal update status bayar");
    }
  };

  const updateDeliveryStatus = async (newStatus) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryStatus: newStatus }),
    });
    if (res.ok) {
      fetchOrder();
      alert("Status pengiriman berhasil diubah!");
    } else {
      alert("Gagal update status kirim");
    }
  };

  const deleteOrder = async () => {
    if (!confirm("Yakin hapus pesanan ini?")) return;
    const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard/admin/orders");
    else alert("Gagal hapus");
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  if (loading) return <div style={{ padding: 50, textAlign: "center" }}>Loading...</div>;
  if (!order) return <div style={{ padding: 50, textAlign: "center" }}>Order tidak ditemukan</div>;

  const itemsSubtotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const totalAmount = itemsSubtotal + (order.shippingCost || 0);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 30, background: "#fff", minHeight: "100vh" }}>
      <div style={{ border: "2px solid #000", borderRadius: 12, padding: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: "center" }}>DETAIL PESANAN</h1>
        <div style={{ textAlign: "center", fontSize: 16, marginBottom: 30, color: "#666" }}>{order.orderNumber}</div>

        {/* 2 KOLOM */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 30 }}>
          {/* KIRI */}
          <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
            <h2 style={{ fontSize: 18, marginBottom: 15 }}>INFORMASI PELANGGAN</h2>
            <p><strong>Nama:</strong> {order.customerName}</p>
            <p><strong>Email:</strong> {order.customerEmail}</p>
            <p><strong>Telepon:</strong> {order.customerPhone}</p>
            <p><strong>Alamat:</strong> {order.customerAddress}</p>
          </div>

          {/* KANAN - DROPDOWN ADA DI SINI */}
          <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
            <h2 style={{ fontSize: 18, marginBottom: 15 }}>INFORMASI PEMBAYARAN</h2>
            <p><strong>Metode:</strong> {order.paymentMethod}</p>
            
            <p>
              <strong>Status Bayar:</strong>{" "}
              <select 
                value={order.paymentStatus} 
                onChange={(e) => updatePaymentStatus(e.target.value)}
                style={{ marginLeft: 10, padding: "5px 10px", border: "1px solid #000", borderRadius: 5, cursor: "pointer" }}
              >
                <option value="WAITING_PAYMENT">⏳ PENDING</option>
                <option value="PAID">✅ LUNAS</option>
                <option value="CANCELLED">❌ BATAL</option>
              </select>
            </p>
            
            <p>
              <strong>Status Kirim:</strong>{" "}
              <select 
                value={order.deliveryStatus || "PENDING"} 
                onChange={(e) => updateDeliveryStatus(e.target.value)}
                style={{ marginLeft: 10, padding: "5px 10px", border: "1px solid #000", borderRadius: 5, cursor: "pointer" }}
              >
                <option value="PENDING">⏳ MENUNGGU</option>
                <option value="SHIPPED">🚚 SEDANG DIANTAR</option>
                <option value="DELIVERED">✅ PESANAN DITERIMA</option>
                <option value="PICKED_UP">🏪 DIAMBIL PEMBELI</option>
              </select>
            </p>
            
            <p><strong>Tanggal:</strong> {new Date(order.createdAt).toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* PRODUK */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, marginBottom: 30 }}>
          <div style={{ background: "#000", color: "#fff", display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr", padding: 12 }}>
            <div>PRODUK</div><div>QTY</div><div style={{ textAlign: "right" }}>HARGA</div><div style={{ textAlign: "right" }}>SUBTOTAL</div>
          </div>
          {order.items?.map((item) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr", padding: 12, borderBottom: "1px solid #ddd" }}>
              <div>{item.product?.name}</div>
              <div>{item.quantity}</div>
              <div style={{ textAlign: "right" }}>{formatRupiah(item.price)}</div>
              <div style={{ textAlign: "right" }}>{formatRupiah(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div style={{ textAlign: "right", borderTop: "1px solid #ddd", paddingTop: 20 }}>
          <p>Subtotal: {formatRupiah(itemsSubtotal)}</p>
          <p>Ongkir: {formatRupiah(order.shippingCost)}</p>
          <h2>TOTAL: {formatRupiah(totalAmount)}</h2>
        </div>

        {/* HAPUS */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={deleteOrder} style={{ padding: "10px 20px", border: "1px solid #000", background: "transparent", cursor: "pointer" }}>
            🗑️ HAPUS PESANAN
          </button>
        </div>
      </div>
    </div>
  );
}