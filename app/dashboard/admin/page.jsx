"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminHome() {
  const router = useRouter();
  const [isHoveringProducts, setIsHoveringProducts] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          backgroundColor: "#fafafa",
          borderRight: "1px solid #eaeaea",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "fixed",
        }}
      >
        {/* Logo Section */}
        <div style={{ padding: "32px 24px", borderBottom: "1px solid #eaeaea" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#000000",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              🍜
            </div>
            <div>
              <h1
                style={{
                  fontSize: "18px",
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
                  fontSize: "12px",
                  color: "#6b6b6b",
                  margin: "4px 0 0 0",
                }}
              >
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: "24px", flex: 1 }}>
          <div style={{ marginBottom: "16px" }}>
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

          {/* Dashboard Menu - Active */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "#000000",
              color: "#ffffff",
              borderRadius: "10px",
              marginBottom: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ marginRight: "12px", fontSize: "20px" }}>📊</span>
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Dashboard</span>
          </div>

          {/* Products Menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              color: isHoveringProducts ? "#000000" : "#404040",
              backgroundColor: isHoveringProducts ? "#f0f0f0" : "transparent",
              borderRadius: "10px",
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

          {/* Orders Menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              color: "#404040",
              borderRadius: "10px",
              marginBottom: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#404040";
            }}
          >
            <span style={{ marginRight: "12px", fontSize: "20px" }}>📦</span>
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Orders</span>
          </div>

          {/* Customers Menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              color: "#404040",
              borderRadius: "10px",
              marginBottom: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#404040";
            }}
          >
            <span style={{ marginRight: "12px", fontSize: "20px" }}>👥</span>
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Customers</span>
          </div>
        </div>

        {/* User Profile Bottom + Logout */}
        <div
          style={{
            padding: "24px",
            borderTop: "1px solid #eaeaea",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#eaeaea",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#404040",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              A
            </div>
            <div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                }}
              >
                Admin User
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#8c8c8c",
                  margin: "4px 0 0 0",
                }}
              >
                admin@foodie.com
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              await fetch("/api/logout");
              router.push("/auth/login");
            }}
            style={{
              marginTop: "12px",
              padding: "8px 12px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "#ff4d4f",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: "280px",
          padding: "40px",
          backgroundColor: "#ffffff",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: 700 }}>Welcome back, Admin</h2>
        <p style={{ color: "#6b6b6b" }}>
          Here's what's happening with your food business today.
        </p>

        <div
          style={{
            marginTop: "32px",
            backgroundColor: "#fafafa",
            padding: "32px",
            borderRadius: "20px",
            border: "1px solid #eaeaea",
          }}
        >
          <h3 style={{ margin: 0, marginBottom: "16px" }}>Manage Your Products</h3>
          <p style={{ margin: 0, marginBottom: "24px", color: "#6b6b6b" }}>
            Add new food items, update prices, and manage your menu inventory.
          </p>
          <button
            onClick={() => router.push("/dashboard/admin/products")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Go to Products →
          </button>
        </div>
      </div>
    </div>
  );
}
