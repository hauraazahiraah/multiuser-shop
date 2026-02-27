"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { signOut } from "next-auth/react";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number || 0);
};

export default function UserProducts() {
  const router = useRouter();
  const { addToCart, cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/product");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    const result = await addToCart(productId, 1);
    setAddingId(null);
    if (!result.success) {
      alert(result.error || "Failed to add to cart");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  // Group products by category
  const categories = products.reduce((acc, product) => {
    const category = product.category || "Lainnya";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #eaeaea;
            border-top: 4px solid #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          p {
            color: #666;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="user-products">
      {/* Header */}
      <header className="header">
        <div className="header-left" onClick={() => router.push("/dashboard/user")}>
          <div className="logo">SS</div>
          <h1 className="brand">Serein Space</h1>
        </div>

        <nav className="main-nav">
          <button
            className="nav-link"
            onClick={() => router.push("/dashboard/user")}
          >
            Home
          </button>
          <button
            className="nav-link active"
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

          {/* Avatar */}
          <div className="avatar">U</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => router.push("/dashboard/user")}>Dashboard</span>
            <span>/</span>
            <span className="current">Products</span>
          </div>

          {/* Page Title */}
          <div className="page-header">
            <h2 className="page-title">OUR MENU</h2>
            <p className="page-subtitle">{products.length} delicious items available</p>
          </div>

          {/* Products Grid by Category */}
          {products.length > 0 ? (
            Object.keys(categories).map((category) => (
              <section key={category} className="category-section">
                <div className="category-header">
                  <h3 className="category-title">{category}</h3>
                  <span className="category-count">{categories[category].length} items</span>
                </div>

                <div className="products-grid">
                  {categories[category].map((product) => (
                    <div key={product.id} className="product-card">
                      {/* Image */}
                      <div className="product-image">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <span className="placeholder">🍽️</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="product-info">
                        <h4 className="product-name">{product.name}</h4>
                        <div className="product-price">{formatRupiah(product.price)}</div>
                        <div className="product-stock">Stock: {product.stock}</div>
                      </div>

                      <button
                        className="add-btn"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingId === product.id}
                      >
                        {addingId === product.id ? "Adding..." : "Add to Cart"} <span>+</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No products available</h3>
              <p>Check back later for our delicious menu</p>
            </div>
          )}
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
        .user-products {
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

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .breadcrumb span {
          cursor: pointer;
          transition: color 0.2s;
        }

        .breadcrumb span:hover {
          color: #000;
        }

        .breadcrumb .current {
          color: #000;
          font-weight: 700;
        }

        /* Page Header */
        .page-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }

        .page-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        /* Category Section */
        .category-section {
          margin-bottom: 48px;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #000;
        }

        .category-title {
          font-size: 20px;
          font-weight: 800;
          color: #000;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .category-count {
          padding: 4px 12px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #000;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .product-card {
          background: #fff;
          border: 2px solid #000;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .product-image {
          width: 100%;
          height: 180px;
          background: #f5f5f5;
          border-bottom: 2px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder {
          font-size: 48px;
          color: #999;
        }

        .product-info {
          padding: 16px;
          flex: 1;
        }

        .product-name {
          font-size: 16px;
          font-weight: 700;
          color: #000;
          margin: 0 0 8px;
          line-height: 1.4;
        }

        .product-price {
          font-size: 18px;
          font-weight: 800;
          color: #000;
          margin: 0 0 8px;
        }

        .product-stock {
          font-size: 13px;
          color: #666;
          font-weight: 500;
          padding: 4px 12px;
          background: #f5f5f5;
          display: inline-block;
          border-radius: 20px;
          border: 1px solid #000;
        }

        .add-btn {
          margin: 0 16px 16px;
          padding: 12px;
          background: #000;
          color: #fff;
          border: 2px solid #000;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .add-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .add-btn:disabled {
          background: #999;
          border-color: #999;
          cursor: not-allowed;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          color: #000;
          margin: 0 0 8px;
        }

        .empty-state p {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 500;
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
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }
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