"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Tidak render di server, hindari FOUC
  }

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
    <div className={styles["login-page"]}>
      <div className={styles["login-card"]}>
        <h2 className={styles["login-title"]}>LOGIN</h2>
        <p className={styles["login-sub"]}>Please enter your details to sign in</p>

        {error && <div className={styles["error-message"]}>{error}</div>}

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>EMAIL</label>
          <input
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["form-input"]}
          />
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>PASSWORD</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["form-input"]}
          />
        </div>

        <button
          className={styles["login-btn"]}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <div className={styles["register-link"]}>
          <p>
            Don't have an account?{" "}
            <button onClick={() => router.push("/auth/register")}>
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}