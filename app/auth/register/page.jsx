"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role: "USER"
        }),
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
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">REGISTER</h2>
        <p className="register-sub">Please fill in your details to get started</p>

        <div className="form-group">
          <label className="form-label">FULL NAME</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">EMAIL</label>
          <input
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">PASSWORD</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          <p className="input-hint">Minimum 6 characters</p>
        </div>

        <button
          className="register-btn"
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? "SIGNING UP..." : "SIGN UP"}
        </button>

        <div className="login-link">
          <p>
            Already have an account?{" "}
            <button onClick={() => router.push("/auth/login")}>
              Sign in
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .register-card {
          max-width: 360px;
          width: 100%;
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .register-title {
          font-size: 24px;
          font-weight: 800;
          color: #000;
          margin: 0 0 6px;
          letter-spacing: -0.3px;
          text-transform: uppercase;
        }

        .register-sub {
          font-size: 14px;
          color: #666;
          margin: 0 0 28px;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #000;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 2px solid #000;
          border-radius: 10px;
          background: #fff;
          color: #000;
          outline: none;
          box-sizing: border-box;
          font-weight: 500;
        }

        .form-input:focus {
          border-color: #333;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
        }

        .form-input::placeholder {
          color: #999;
          font-weight: 400;
        }

        .input-hint {
          font-size: 12px;
          color: #666;
          margin: 6px 0 0;
          font-weight: 500;
        }

        .register-btn {
          width: 100%;
          padding: 14px;
          background: #000;
          color: #fff;
          border: 2px solid #000;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          margin: 10px 0 28px;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .register-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .register-btn:disabled {
          background: #999;
          border-color: #999;
          cursor: not-allowed;
        }

        .login-link {
          text-align: center;
          border-top: 2px solid #000;
          padding-top: 20px;
        }

        .login-link p {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .login-link button {
          background: none;
          border: none;
          color: #000;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          font: inherit;
          font-weight: 700;
        }

        .login-link button:hover {
          color: #333;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .register-card {
            padding: 28px 20px;
          }
          .register-title {
            font-size: 22px;
          }
          .form-input {
            padding: 10px 14px;
            font-size: 14px;
          }
          .register-btn {
            padding: 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}