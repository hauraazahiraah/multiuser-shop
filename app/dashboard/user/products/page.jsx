"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { signOut, useSession } from "next-auth/react";
import styles from "../user.module.css";

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
  const { data: session } = useSession();
  const { addToCart, cartCount, cartItems } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "U";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

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

  // Hitung sisa stok = stok asli - jumlah di cart
  const getRemainingStock = (product) => {
    const cartItem = cartItems?.find((i) => i.productId === product.id);
    const qtyInCart = cartItem ? cartItem.quantity : 0;
    return product.stock - qtyInCart;
  };

  const handleAddToCart = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) {
      alert("Stok habis!");
      return;
    }

    setAddingId(productId);

    // LANGSUNG PANGGIL addToCart, TANPA optimistik update stok
    const result = await addToCart(productId, 1);

    if (!result.success) {
      alert(result.error || "Gagal menambahkan ke keranjang");
    }

    setAddingId(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  // Kelompokkan produk berdasarkan kategori
  const categories = products.reduce((acc, product) => {
    const category = product.category || "Lainnya";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}></div>
        <p>Loading products...</p>
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
            className={styles["nav-link"]}
            onClick={() => router.push("/dashboard/user")}
          >
            Home
          </button>
          <button
            className={`${styles["nav-link"]} ${styles.active}`}
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

      <main className={styles["products-content"]}>
        <div className={styles["products-container"]}>
          <div className={styles["page-header"]}>
            <h2 className={styles["page-title"]}>OUR MENU</h2>
            <p className={styles["page-subtitle"]}>
              {products.length} delicious items available
            </p>
          </div>

          {products.length > 0 ? (
            Object.keys(categories).map((category) => (
              <section key={category} className={styles["category-section"]}>
                <div className={styles["category-header"]}>
                  <h3 className={styles["category-title"]}>{category}</h3>
                  <span className={styles["category-count"]}>
                    {categories[category].length} items
                  </span>
                </div>

                <div className={styles["products-grid"]}>
                  {categories[category].map((product) => {
                    const remainingStock = getRemainingStock(product);
                    const isOutOfStock = remainingStock <= 0;

                    return (
                      <div key={product.id} className={styles["product-card"]}>
                        <div className={styles["product-image"]}>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} />
                          ) : (
                            <span className={styles.placeholder}>🍽️</span>
                          )}
                        </div>
                        <div className={styles["product-info"]}>
                          <h4 className={styles["product-name"]}>{product.name}</h4>
                          <div className={styles["product-price"]}>
                            {formatRupiah(product.price)}
                          </div>
                          <div className={styles["product-stock"]}>
                            Stock: {remainingStock}
                          </div>
                        </div>
                        <button
                          className={`${styles["add-btn"]} ${
                            isOutOfStock ? styles.disabled : ""
                          }`}
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingId === product.id || isOutOfStock}
                        >
                          {addingId === product.id
                            ? "Adding..."
                            : isOutOfStock
                            ? "Out of Stock"
                            : "Add to Cart +"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className={styles["empty-state"]}>
              <div className={styles["empty-icon"]}>🍽️</div>
              <h3>No products available</h3>
              <p>Check back later for our delicious menu</p>
            </div>
          )}
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