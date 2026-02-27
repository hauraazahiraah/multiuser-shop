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

      const session = await fetch("/api/auth/session").then(res => res.json());
      
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
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">LOGIN</h2>
        <p className="login-sub">Please enter your details to sign in</p>

        {error && <div className="error-message">{error}</div>}

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
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <button onClick={() => router.push("/auth/register")}>
              Create an account
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .login-card {
          max-width: 360px;
          width: 100%;
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .login-title {
          font-size: 24px;
          font-weight: 800;
          color: #000;
          margin: 0 0 6px;
          letter-spacing: -0.3px;
          text-transform: uppercase;
        }

        .login-sub {
          font-size: 14px;
          color: #666;
          margin: 0 0 28px;
          font-weight: 500;
        }

        .error-message {
          background: #fff1f0;
          border: 2px solid #000;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 20px;
          color: #000;
          font-size: 13px;
          font-weight: 600;
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

        .login-btn {
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

        .login-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .login-btn:disabled {
          background: #999;
          border-color: #999;
          cursor: not-allowed;
        }

        .register-link {
          text-align: center;
          border-top: 2px solid #000;
          padding-top: 20px;
        }

        .register-link p {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .register-link button {
          background: none;
          border: none;
          color: #000;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          font: inherit;
          font-weight: 700;
        }

        .register-link button:hover {
          color: #333;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .login-card {
            padding: 28px 20px;
          }
          .login-title {
            font-size: 22px;
          }
          .form-input {
            padding: 10px 14px;
            font-size: 14px;
          }
          .login-btn {
            padding: 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}