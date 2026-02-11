"use client"; // <-- INI WAJIB!

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account registered successfully!");
        router.push("/auth/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("An error occurred during registration");
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
            Create account
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#6b6b6b",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Please fill in your details to get started
          </p>
        </div>

        <div style={{ marginBottom: "32px" }}>
          {/* Name */}
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
              Full name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            />
          </div>

          {/* Email */}
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
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            />
          </div>

          {/* Password */}
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
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#8c8c8c",
                marginTop: "6px",
                marginBottom: 0,
              }}
            >
              Minimum 6 characters
            </p>
          </div>

          {/* Role */}
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
              Account type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "16px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            >
              <option value="USER">User account</option>
              <option value="ADMIN">Admin account</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRegister}
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
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </div>

        {/* Link to Login */}
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
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
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
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#404040")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#000000")}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}