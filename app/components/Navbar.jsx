"use client";

import Link from "next/link";

export default function Navbar({ role }) {

  return (
    <nav className="navbar">

      <div className="nav-title">
        MultiUser Shop
      </div>

      <div className="nav-links">

        {role === "ADMIN" && (
          <>
            <Link href="/dashboard/admin">Dashboard</Link>
            <Link href="/dashboard/admin">CRUD Product</Link>
          </>
        )}

        {role === "USER" && (
          <>
            <Link href="/dashboard/user">Dashboard</Link>
            <Link href="/dashboard/user/cart">Cart</Link>
            <Link href="/dashboard/user/history">History</Link>
          </>
        )}

        <button
          onClick={async () => {

            if (!confirm("Are you sure you want to logout?")) return;

            await fetch("/api/logout");
            window.location.href = "/auth/login";
          }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}
