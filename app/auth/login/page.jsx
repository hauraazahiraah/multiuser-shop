"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText || "Login failed");
        return;
      }

      const data = await res.json();

      if (data.role?.toLowerCase() === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (error) {
      alert("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "48px 32px",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#000000",
              margin: 0,
              marginBottom: "8px",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#6b6b6b",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Please enter your details to sign in
          </p>
        </div>

        {/* Form */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1a1a1a",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "15px",
                border: "1.5px solid #e5e5e5",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                color: "#000000",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1a1a1a",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "15px",
                border: "1.5px solid #e5e5e5",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                color: "#000000",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: isLoading ? "#8c8c8c" : "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = "#333333";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = "#000000";
            }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        {/* Register Link */}
        <div
          style={{
            textAlign: "center",
            borderTop: "1px solid #f0f0f0",
            paddingTop: "32px",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: "#6b6b6b",
              margin: 0,
            }}
          >
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/auth/register")}
              style={{
                background: "none",
                border: "none",
                color: "#000000",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
                fontWeight: 600,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#404040")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#000000")}
            >
              Create an account
            </button>
          </p>
        </div>

        {/* Subtle credit (optional) */}
        <div
          style={{
            marginTop: "48px",
            textAlign: "center",
            fontSize: "12px",
            color: "#a3a3a3",
          }}
        >
          © 2024 Your Company
        </div>
      </div>
    </div>
  );
}