"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import styles from "./admin.module.css";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // untuk tahu halaman mana yang aktif
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <div className={styles["admin-home"]}>
      {/* HEADER */}
      <header className={styles.header}>
        <div
          className={styles["header-left"]}
          onClick={() => router.push("/dashboard/admin")}
        >
          <div className={styles.logo}>SS</div>
          <h1 className={styles.brand}>Serein Space</h1>
        </div>

        <nav className={styles["main-nav"]}>
          <button
            className={`${styles["nav-link"]} ${
              isActive("/dashboard/admin") ? styles.active : ""
            }`}
            onClick={() => router.push("/dashboard/admin")}
          >
            Dashboard
          </button>
          <button
            className={`${styles["nav-link"]} ${
              isActive("/dashboard/admin/products") ? styles.active : ""
            }`}
            onClick={() => router.push("/dashboard/admin/products")}
          >
            Products
          </button>
          <button
            className={`${styles["nav-link"]} ${
              isActive("/dashboard/admin/orders") ? styles.active : ""
            }`}
            onClick={() => router.push("/dashboard/admin/orders")}
          >
            Orders Report
          </button>
        </nav>

        <div className={styles["header-right"]}>
          <div
            className={styles["profile-btn"]}
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
            onClick={() => router.push("/dashboard/admin/profile")}
          >
            <div className={styles.avatar}>A</div>
            {isHoveringProfile && (
              <div className={styles["profile-info"]}>
                <p className={styles["profile-name"]}>Admin User</p>
                <p className={styles["profile-email"]}>admin@serein.space</p>
              </div>
            )}
          </div>

          <button
            className={styles["logout-btn"]}
            onMouseEnter={() => setIsHoveringLogout(true)}
            onMouseLeave={() => setIsHoveringLogout(false)}
            onClick={() => signOut({ redirect: true, callbackUrl: "/auth/login" })}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT - di sini anak-anak halaman akan dirender */}
      <main className={styles.content}>{children}</main>

      {/* FOOTER */}
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