"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";

export default function AdminHome() {
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Welcome */}
      <section className={styles["welcome-card"]}>
        <h2 className={styles["welcome-title"]}>
          Welcome back, <span className={styles["welcome-badge"]}>Admin</span>
        </h2>
        <p className={styles["welcome-sub"]}>
          Here's what's happening with your business today.
        </p>
      </section>

      {/* Stats */}
      <div className={styles["stats-grid"]}>
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

      {/* Charts */}
      <div className={styles["charts-grid"]}>
        <div className={styles["chart-card"]}>
          <h3 className={styles["chart-title"]}>Sales Overview</h3>
          <div className={styles["chart-placeholder"]}>📊 Chart akan muncul di sini</div>
        </div>
        <div className={styles["chart-card"]}>
          <h3 className={styles["chart-title"]}>Order Status</h3>
          <div className={styles["status-bars"]}>
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
    </>
  );
}

// StatCard Component
const StatCard = ({ icon, label, value, sublabel }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
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