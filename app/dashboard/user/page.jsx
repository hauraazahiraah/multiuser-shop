"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { signOut, useSession } from "next-auth/react";
import styles from "./user.module.css";

export default function UserHome() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [totalProducts, setTotalProducts] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "U";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await fetch("/api/product");
        if (productRes.ok) {
          const products = await productRes.json();
          setTotalProducts(products.length);
        }
        const orderRes = await fetch("/api/orders/user");
        if (orderRes.ok) {
          const orders = await orderRes.json();
          setOrderCount(orders.length);
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles["user-home"]}>
      <header className={styles.header}>
        <div
          className={styles["header-left"]}
          onClick={() => router.push("/dashboard/user")}
        >
          <div className={styles.logo}>SS</div>
          <h1 className={styles.brand}>Serein Space</h1>
        </div>

        <nav className={styles["main-nav"]}>
          <button
            className={`${styles["nav-link"]} ${styles.active}`}
            onClick={() => router.push("/dashboard/user")}
          >
            Home
          </button>
          <button
            className={styles["nav-link"]}
            onClick={() => router.push("/dashboard/user/products")}
          >
            Products
          </button>
          <button
            className={styles["nav-link"]}
            onClick={() => router.push("/dashboard/user/history")}
          >
            Orders
          </button>
        </nav>

        <div className={styles["header-right"]}>
          <div
            className={styles["cart-icon"]}
            onClick={() => router.push("/dashboard/user/cart")}
          >
            <span>🛒</span>
            {cartCount > 0 && (
              <span className={styles["cart-badge"]}>{cartCount}</span>
            )}
          </div>

          <button
            className={styles["logout-btn"]}
            onMouseEnter={() => setIsHoveringLogout(true)}
            onMouseLeave={() => setIsHoveringLogout(false)}
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

          <div
            className={styles["avatar-wrapper"]}
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
          >
            <div className={styles.avatar}>{userInitial}</div>
            {isHoveringProfile && (
              <div className={styles["profile-info"]}>
                <p className={styles["profile-name"]}>{userName}</p>
                <p className={styles["profile-email"]}>{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.container}>
          {/* Hero Section - Hitam Putih */}
          <div className={styles.hero}>
            <div className={styles["hero-text"]}>
              <div className={styles["hero-badge"]}>☕ Welcome back</div>
              <h2 className={styles["hero-title"]}>Hello, {userName}!</h2>
              <p className={styles["hero-subtitle"]}>
                Enjoy your favorite space-themed coffee and drinks.
              </p>
              <button
                className={styles["hero-btn"]}
                onClick={() => router.push("/dashboard/user/products")}
              >
                Order Now →
              </button>
            </div>
            <div className={styles["hero-emoji"]}>🚀✨</div>
          </div>

          {/* Statistik & Aksi Cepat */}
          <div className={styles["quick-actions"]}>
            <div className={styles["section-header"]}>
              <h3 className={styles["section-title"]}>Your Activity</h3>
            </div>
            <div className={styles["actions-grid"]}>
              <div
                className={styles["action-card"]}
                onClick={() => router.push("/dashboard/user/history")}
              >
                <div className={styles["action-icon"]}>📦</div>
                <div className={styles["action-text"]}>
                  <h4>{orderCount}</h4>
                  <p>Total Orders</p>
                </div>
                <div className={styles["action-arrow"]}>→</div>
              </div>
              <div
                className={styles["action-card"]}
                onClick={() => router.push("/dashboard/user/cart")}
              >
                <div className={styles["action-icon"]}>🛒</div>
                <div className={styles["action-text"]}>
                  <h4>{cartCount}</h4>
                  <p>Items in Cart</p>
                </div>
                <div className={styles["action-arrow"]}>→</div>
              </div>
              <div
                className={styles["action-card"]}
                onClick={() => router.push("/dashboard/user/products")}
              >
                <div className={styles["action-icon"]}>🍽️</div>
                <div className={styles["action-text"]}>
                  <h4>{totalProducts}</h4>
                  <p>Menu Items</p>
                </div>
                <div className={styles["action-arrow"]}>→</div>
              </div>
            </div>
          </div>

          {/* Promo - Hitam Putih */}
          <div
            className={styles.promo}
            style={{
              background: "#f5f5f5",
              color: "#000",
              border: "1px solid #eef2f6",
            }}
          >
            <div className={styles["promo-content"]}>
              <span
                className={styles["promo-tag"]}
                style={{ background: "#000", color: "#fff", fontWeight: "bold" }}
              >
                Limited Offer
              </span>
              <h3
                className={styles["promo-title"]}
                style={{ color: "#000", fontWeight: "800" }}
              >
                Free Delivery on Orders over Rp 100k
              </h3>
              <p className={styles["promo-code"]} style={{ color: "#555", fontWeight: "500" }}>
                Use code: SPACE10
              </p>
            </div>
            <button
              className={styles["promo-btn"]}
              style={{ background: "#000", color: "#fff", fontWeight: "bold" }}
              onClick={() => router.push("/dashboard/user/products")}
            >
              Shop Now
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles["footer-left"]}>
          <span>© 2026 Serein Space. All rights reserved.</span>
          <span>v1.0.0</span>
        </div>
        <div className={styles["footer-right"]}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help</span>
        </div>
      </footer>
    </div>
  );
}