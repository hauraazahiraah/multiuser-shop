"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal mengambil data");
      }
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders(); // refresh
      } else {
        const err = await res.json();
        alert(err.error || "Gagal update status");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Terjadi kesalahan saat update");
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm("Yakin hapus pesanan ini?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchOrders();
      } else {
        alert("Gagal hapus pesanan");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "pending") return order.paymentStatus === "WAITING_PAYMENT";
    if (filter === "paid") return order.paymentStatus === "PAID";
    if (filter === "cancelled") return order.paymentStatus === "CANCELLED";
    return true;
  });

  // ✅ PERBAIKAN: Pakai 'total' bukan 'totalAmount'
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrder = filteredOrders.length ? Math.round(totalRevenue / filteredOrders.length) : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat pesanan...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #fff;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f0f0f0;
            border-top: 4px solid #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h3>Error: {error}</h3>
        <button onClick={fetchOrders}>Coba lagi</button>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="content">
        <div className="header">
          <h1 className="title">LAPORAN PESANAN</h1>
          <p className="subtitle">Semua transaksi dari seluruh pelanggan</p>
        </div>

        <div className="filter-tabs">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>SEMUA</button>
          <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>PENDING</button>
          <button className={`filter-btn ${filter === "paid" ? "active" : ""}`} onClick={() => setFilter("paid")}>LUNAS</button>
          <button className={`filter-btn ${filter === "cancelled" ? "active" : ""}`} onClick={() => setFilter("cancelled")}>BATAL</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><p className="stat-label">Total Pesanan</p><p className="stat-value">{filteredOrders.length}</p></div>
          <div className="stat-card"><p className="stat-label">Total Pendapatan</p><p className="stat-value">{formatRupiah(totalRevenue)}</p></div>
          <div className="stat-card"><p className="stat-label">Rata-rata per Pesanan</p><p className="stat-value">{formatRupiah(avgOrder)}</p></div>
        </div>

        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Pelanggan</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Metode</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  {/* ✅ PERBAIKAN: Pakai 'total' di sini juga */}
                  <td className="order-id" onClick={() => router.push(`/dashboard/admin/orders/${order.id}`)}>{order.orderNumber}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{order.customerName}</span>
                      <span className="customer-email">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="total-cell">{formatRupiah(order.total)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select 
                      value={order.paymentStatus} 
                      onChange={(e) => updateStatus(order.id, e.target.value)} 
                      className="status-select"
                    >
                      <option value="WAITING_PAYMENT">PENDING</option>
                      <option value="PAID">LUNAS</option>
                      <option value="CANCELLED">BATAL</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="detail-btn" onClick={() => router.push(`/dashboard/admin/orders/${order.id}`)}>Detail</button>
                      <button className="delete-btn" onClick={() => deleteOrder(order.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .admin-orders { min-height: 100vh; background: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .content { max-width: 1400px; margin: 0 auto; padding: 40px 30px; }
        .title { font-size: 32px; font-weight: 800; margin: 0 0 8px; text-transform: uppercase; }
        .subtitle { font-size: 16px; color: #666; margin: 0; }
        .filter-tabs { display: flex; gap: 15px; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
        .filter-btn { background: none; border: none; padding: 8px 20px; font-weight: 700; color: #666; cursor: pointer; text-transform: uppercase; border-radius: 4px; }
        .filter-btn:hover { color: #000; background: #f0f0f0; }
        .filter-btn.active { background: #000; color: white; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-bottom: 40px; }
        .stat-card { background: #fff; border: 2px solid #000; border-radius: 10px; padding: 30px; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .stat-label { font-size: 14px; font-weight: 700; color: #666; margin: 0 0 15px; text-transform: uppercase; }
        .stat-value { font-size: 36px; font-weight: 800; margin: 0; }
        .table-container { background: #fff; border: 2px solid #000; border-radius: 12px; overflow-x: auto; }
        .orders-table { width: 100%; border-collapse: collapse; font-size: 15px; }
        .orders-table th { background: #000; color: white; padding: 18px 16px; text-align: left; }
        .orders-table td { padding: 16px; border-bottom: 1px solid #000; }
        .orders-table tbody tr:hover { background: #f9f9f9; }
        .order-id { font-weight: 700; cursor: pointer; }
        .order-id:hover { text-decoration: underline; }
        .customer-name { font-weight: 700; display: block; }
        .customer-email { font-size: 13px; color: #666; }
        .total-cell { font-weight: 700; }
        .status-select { padding: 8px 12px; border: 2px solid #000; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .action-buttons { display: flex; gap: 8px; }
        .detail-btn { padding: 8px 16px; background: #000; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; }
        .detail-btn:hover { background: #333; transform: translateY(-2px); }
        .delete-btn { padding: 8px 12px; background: transparent; border: 2px solid #000; border-radius: 6px; cursor: pointer; }
        .delete-btn:hover { background: #000; color: white; }
        @media (max-width: 768px) { .content { padding: 20px; } .title { font-size: 24px; } .stats-grid { grid-template-columns: 1fr; } .orders-table { min-width: 700px; } }
      `}</style>
    </div>
  );
}