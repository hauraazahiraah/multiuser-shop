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
  const [filter, setFilter] = useState("all");

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, paymentStatus: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm("Yakin mau hapus pesanan ini? 🗑️")) return;

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Hapus dari state
        setOrders((prev) => prev.filter((order) => order.id !== id));
      } else {
        alert("Gagal hapus pesanan");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "pending") return order.paymentStatus !== "PAID";
    if (filter === "paid") return order.paymentStatus === "PAID";
    return true;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrder =
    filteredOrders.length > 0
      ? Math.round(totalRevenue / filteredOrders.length)
      : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Memuat pesanan...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid #f0f0f0;
            border-top: 4px solid #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-text {
            font-size: 18px;
            font-weight: 600;
            color: #000;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="content">
        {/* Header */}
        <div className="header">
          <h1 className="title">LAPORAN PESANAN</h1>
          <p className="subtitle">Semua transaksi dari seluruh pelanggan</p>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            SEMUA
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            PENDING
          </button>
          <button
            className={`filter-btn ${filter === "paid" ? "active" : ""}`}
            onClick={() => setFilter("paid")}
          >
            LUNAS
          </button>
        </div>

        {/* Stat cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Pesanan</p>
            <p className="stat-value">{filteredOrders.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Pendapatan</p>
            <p className="stat-value">{formatRupiah(totalRevenue)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Rata-rata per Pesanan</p>
            <p className="stat-value">{formatRupiah(avgOrder)}</p>
          </div>
        </div>

        {/* Tabel */}
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
                  <td
                    className="order-id"
                    onClick={() => router.push(`/dashboard/admin/orders/${order.id}`)}
                  >
                    {order.orderNumber}
                  </td>
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
                      <button
                        onClick={() => router.push(`/dashboard/admin/orders/${order.id}`)}
                        className="detail-btn"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="delete-btn"
                        title="Hapus pesanan"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .admin-orders {
          min-height: 100vh;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #000;
        }

        .content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 30px;
        }

        /* Header */
        .header {
          margin-bottom: 30px;
        }

        .title {
          font-size: 32px;
          font-weight: 800;
          color: #000;
          margin: 0 0 8px 0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .subtitle {
          font-size: 16px;
          font-weight: 500;
          color: #666;
          margin: 0;
        }

        /* Filter tabs */
        .filter-tabs {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
        }

        .filter-btn {
          background: none;
          border: none;
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          border-radius: 4px;
        }

        .filter-btn:hover {
          color: #000;
          background: #f0f0f0;
        }

        .filter-btn.active {
          color: #000;
          background: #000;
          color: white;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-label {
          font-size: 14px;
          font-weight: 700;
          color: #666;
          margin: 0 0 15px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 800;
          color: #000;
          margin: 0;
          line-height: 1.2;
          word-break: break-word;
        }

        /* Table container */
        .table-container {
          background: #fff;
          border: 2px solid #000;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }

        .orders-table th {
          background: #000;
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 18px 16px;
          text-align: left;
          border-right: 1px solid #333;
        }

        .orders-table th:last-child {
          border-right: none;
        }

        .orders-table td {
          padding: 16px;
          border-bottom: 1px solid #000;
          color: #000;
          font-weight: 500;
        }

        .orders-table tbody tr:last-child td {
          border-bottom: none;
        }

        .orders-table tbody tr:hover {
          background: #f9f9f9;
        }

        .order-id {
          font-weight: 700;
          cursor: pointer;
          color: #000;
          transition: color 0.2s;
        }

        .order-id:hover {
          text-decoration: underline;
          color: #333;
        }

        .customer-info {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          font-weight: 700;
          margin-bottom: 4px;
        }

        .customer-email {
          font-size: 13px;
          color: #666;
          font-weight: 400;
        }

        .total-cell {
          font-weight: 700;
        }

        .status-select {
          padding: 8px 12px;
          border: 2px solid #000;
          border-radius: 6px;
          background: white;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
          color: #000;
        }

        .status-select:hover {
          background: #f0f0f0;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .detail-btn {
          padding: 8px 16px;
          background: #000;
          color: white;
          border: 2px solid #000;
          border-radius: 6px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-btn:hover {
          background: white;
          color: #000;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .delete-btn {
          padding: 8px 12px;
          background: transparent;
          color: #000;
          border: 2px solid #000;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content {
            padding: 30px 20px;
          }
          .title {
            font-size: 28px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .filter-tabs {
            flex-wrap: wrap;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .table-container {
            overflow-x: auto;
          }
          .orders-table {
            min-width: 800px;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 24px;
          }
          .filter-btn {
            padding: 6px 12px;
            font-size: 12px;
          }
          .stat-value {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}