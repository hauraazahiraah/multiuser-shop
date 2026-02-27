"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react"; // <-- TAMBAHAN

const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function UserHome() {
  const { data: session } = useSession(); // <-- TAMBAHAN
  const router = useRouter();
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false); // <-- TAMBAHAN
  const { cartCount } = useCart();

  // Ambil inisial & nama dari session
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || 'U'; // <-- TAMBAHAN
  const userName = session?.user?.name || 'User'; // <-- TAMBAHAN
  const userEmail = session?.user?.email || ''; // <-- TAMBAHAN

  // Mock data (ga diubah)
  const categories = [
    { id: 1, name: "Makanan", icon: "🍽️", count: 24 },
    { id: 2, name: "Minuman", icon: "🥤", count: 18 },
    { id: 3, name: "Snack", icon: "🍪", count: 12 },
    { id: 4, name: "Dessert", icon: "🍰", count: 8 },
  ];

  const recommendedItems = [
    { id: 1, name: "Nasi Goreng", category: "Makanan", price: 35000, image: "🍚" },
    { id: 2, name: "Es Teh", category: "Minuman", price: 5000, image: "🧋" },
    { id: 3, name: "Ayam Bakar", category: "Makanan", price: 45000, image: "🍗" },
    { id: 4, name: "Pisang Goreng", category: "Snack", price: 15000, image: "🍌" },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <div className="user-home">
      {/* Header */}
      <header className="header">
        <div className="header-left" onClick={() => router.push("/dashboard/user")}>
          <div className="logo">SS</div>
          <h1 className="brand">Serein Space</h1>
        </div>

        <nav className="main-nav">
          <button
            className="nav-link active"
            onClick={() => router.push("/dashboard/user")}
          >
            Home
          </button>
          <button
            className="nav-link"
            onClick={() => router.push("/dashboard/user/products")}
          >
            Products
          </button>
          <button
            className="nav-link"
            onClick={() => router.push("/dashboard/user/history")}
          >
            Orders
          </button>
        </nav>

        <div className="header-right">
          {/* Cart Icon */}
          <div className="cart-icon" onClick={() => router.push("/dashboard/user/cart")}>
            <span>🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>

          {/* Logout Button */}
          <button
            className="logout-btn"
            onMouseEnter={() => setIsHoveringLogout(true)}
            onMouseLeave={() => setIsHoveringLogout(false)}
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

          {/* Avatar + Profile Info (BAGIAN YANG DIUBAH) */}
          <div
            className="avatar-wrapper"
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
          >
            <div className="avatar">{userInitial}</div>
            {isHoveringProfile && (
              <div className="profile-info">
                <p className="profile-name">{userName}</p>
                <p className="profile-email">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content (SAMA PERSIS) */}
      <main className="content">
        <div className="container">
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-text">
              <h2 className="hero-title">
                Welcome back, <span className="hero-badge">User</span>
              </h2>
              <p className="hero-subtitle">
                Ready to satisfy your cravings? Check out our delicious menu with fresh ingredients and authentic flavors.
              </p>
              <button
                className="hero-btn"
                onClick={() => router.push("/dashboard/user/products")}
              >
                Browse Menu <span>→</span>
              </button>
            </div>
            <div className="hero-emoji">🍳</div>
          </section>

          {/* Categories */}
          <section className="categories">
            <div className="section-header">
              <h3 className="section-title">Browse Categories</h3>
              <button
                className="view-all"
                onClick={() => router.push("/dashboard/user/products")}
              >
                View all →
              </button>
            </div>
            <div className="categories-grid">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => router.push("/dashboard/user/products")}
                >
                  <div className="category-icon">{cat.icon}</div>
                  <h4 className="category-name">{cat.name}</h4>
                  <p className="category-count">{cat.count} items</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <div className="actions-grid">
              <div
                className="action-card"
                onClick={() => router.push("/dashboard/user/products")}
              >
                <div className="action-icon">🍽️</div>
                <div className="action-text">
                  <h4>Browse Menu</h4>
                  <p>Jelajahi menu makanan kami</p>
                </div>
                <span className="action-arrow">→</span>
              </div>
              <div
                className="action-card"
                onClick={() => router.push("/dashboard/user/history")}
              >
                <div className="action-icon">📋</div>
                <div className="action-text">
                  <h4>Order History</h4>
                  <p>Lihat riwayat pesananmu</p>
                </div>
                <span className="action-arrow">→</span>
              </div>
            </div>
          </section>

          {/* Recommended Items */}
          <section className="recommended">
            <div className="section-header">
              <div>
                <h3 className="section-title">Recommended for You</h3>
                <p className="section-subtitle">Based on your previous orders</p>
              </div>
              <button
                className="view-all"
                onClick={() => router.push("/dashboard/user/products")}
              >
                See All
              </button>
            </div>
            <div className="products-grid">
              {recommendedItems.map((item) => (
                <div
                  key={item.id}
                  className="product-card"
                  onClick={() => router.push("/dashboard/user/products")}
                >
                  <div className="product-image">{item.image}</div>
                  <h4 className="product-name">{item.name}</h4>
                  <p className="product-category">{item.category}</p>
                  <div className="product-footer">
                    <span className="product-price">{formatRupiah(item.price)}</span>
                    <button
                      className="add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality (to be implemented)
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Promo Banner */}
          <section className="promo">
            <div className="promo-content">
              <span className="promo-tag">Limited Time Offer</span>
              <h3 className="promo-title">Free Delivery on First Order</h3>
              <p className="promo-code">Use code: WELCOME20</p>
            </div>
            <button className="promo-btn" onClick={() => router.push("/dashboard/user/products")}>
              Order Now →
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <span>© 2026 Serein Space. All rights reserved.</span>
          <span>v1.0.0</span>
        </div>
        <div className="footer-right">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help</span>
        </div>
      </footer>

      <style jsx>{`
        .user-home {
          min-height: 100vh;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .header {
          background: #fff;
          border-bottom: 2px solid #000;
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .logo {
          width: 44px;
          height: 44px;
          background: #000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: 1px;
        }

        .brand {
          font-size: 20px;
          font-weight: 800;
          color: #000;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .main-nav {
          display: flex;
          gap: 8px;
          background: #f5f5f5;
          padding: 4px;
          border-radius: 40px;
          border: 1px solid #000;
        }

        .nav-link {
          padding: 10px 24px;
          background: transparent;
          color: #000;
          border: none;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-link:hover {
          background: #eaeaea;
        }

        .nav-link.active {
          background: #000;
          color: #fff;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cart-icon {
          position: relative;
          padding: 10px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 10px;
          cursor: pointer;
          font-size: 20px;
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #000;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: transparent;
          color: #000;
          border: 2px solid #000;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        /* AVATAR WRAPPER & PROFILE INFO (BARU) */
        .avatar-wrapper {
          position: relative;
          display: inline-block;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: #000;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
        }

        .profile-info {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: #fff;
          border: 2px solid #000;
          border-radius: 10px;
          padding: 12px 16px;
          min-width: 150px;
          z-index: 100;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .profile-name {
          font-size: 14px;
          font-weight: 700;
          color: #000;
          margin: 0 0 4px;
        }

        .profile-email {
          font-size: 12px;
          color: #666;
          margin: 0;
        }

        /* MAIN CONTENT */
        .content {
          flex: 1;
          padding: 40px 32px;
          background: #fafafa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* HERO */
        .hero {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-text {
          max-width: 500px;
        }

        .hero-title {
          font-size: 36px;
          font-weight: 800;
          color: #000;
          margin: 0 0 16px;
          letter-spacing: -1px;
          line-height: 1.2;
        }

        .hero-badge {
          background: #000;
          color: #fff;
          padding: 4px 12px;
          border-radius: 8px;
          font-weight: 700;
        }

        .hero-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0 0 32px;
          line-height: 1.6;
          font-weight: 500;
        }

        .hero-btn {
          padding: 14px 32px;
          background: #000;
          color: #fff;
          border: 2px solid #000;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .hero-btn:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .hero-btn span {
          transition: transform 0.2s;
        }

        .hero-btn:hover span {
          transform: translateX(4px);
        }

        .hero-emoji {
          font-size: 100px;
          opacity: 0.8;
        }

        /* SECTION HEADER */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 800;
          color: #000;
          margin: 0 0 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .view-all {
          padding: 8px 16px;
          background: transparent;
          color: #000;
          border: 2px solid #000;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .view-all:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        /* CATEGORIES */
        .categories {
          margin-bottom: 48px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .category-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .category-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .category-name {
          font-size: 16px;
          font-weight: 700;
          color: #000;
          margin: 0 0 4px;
        }

        .category-count {
          font-size: 13px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        /* QUICK ACTIONS */
        .quick-actions {
          margin-bottom: 48px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .action-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .action-icon {
          width: 56px;
          height: 56px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .action-text {
          flex: 1;
        }

        .action-text h4 {
          font-size: 18px;
          font-weight: 700;
          color: #000;
          margin: 0 0 4px;
        }

        .action-text p {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .action-arrow {
          font-size: 24px;
          color: #666;
          transition: transform 0.2s;
        }

        .action-card:hover .action-arrow {
          transform: translateX(8px);
          color: #000;
        }

        /* RECOMMENDED */
        .recommended {
          margin-bottom: 48px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .product-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .product-image {
          width: 100%;
          height: 140px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          margin-bottom: 12px;
        }

        .product-name {
          font-size: 16px;
          font-weight: 700;
          color: #000;
          margin: 0 0 4px;
        }

        .product-category {
          font-size: 13px;
          color: #666;
          margin: 0 0 12px;
          font-weight: 500;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 16px;
          font-weight: 800;
          color: #000;
        }

        .add-btn {
          padding: 6px 12px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .add-btn:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        /* PROMO */
        .promo {
          background: #000;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .promo-content {
          color: #fff;
        }

        .promo-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(255,255,255,0.2);
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .promo-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .promo-code {
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          margin: 0;
          font-weight: 500;
        }

        .promo-btn {
          padding: 12px 24px;
          background: #fff;
          color: #000;
          border: 2px solid #fff;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .promo-btn:hover {
          background: transparent;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255,255,255,0.2);
        }

        /* FOOTER */
        .footer {
          background: #fff;
          border-top: 2px solid #000;
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .footer-left,
        .footer-right {
          display: flex;
          gap: 24px;
        }

        .footer-right span {
          cursor: pointer;
          transition: color 0.2s;
        }

        .footer-right span:hover {
          color: #000;
          text-decoration: underline;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .categories-grid,
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .header {
            flex-wrap: wrap;
            gap: 16px;
          }
          .main-nav {
            order: 3;
            width: 100%;
            justify-content: center;
          }
          .hero {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }
          .hero-emoji {
            font-size: 80px;
          }
          .actions-grid {
            grid-template-columns: 1fr;
          }
          .promo {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }
        }

        @media (max-width: 480px) {
          .categories-grid,
          .products-grid {
            grid-template-columns: 1fr;
          }
          .footer {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .footer-left,
          .footer-right {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}