"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // ✅ AMBIL SESSION UNTUK CEK ROLE
      const session = await fetch("/api/auth/session").then(res => res.json());
      
      // ✅ REDIRECT BERDASARKAN ROLE
      if (session?.user?.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      } else {
        window.location.href = "/dashboard/user";
      }
    } catch (err) {
      setError("An error occurred during login");
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

        {error && (
          <div
            style={{
              backgroundColor: "#fff1f0",
              border: "1px solid #ffccc7",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "24px",
              color: "#cf1322",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

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
              }}
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
              }}
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
            }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>

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
                cursor: "pointer",
                padding: 0,
                font: "inherit",
                fontWeight: 600,
              }}
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}