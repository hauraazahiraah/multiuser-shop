import prisma from "@/lib/prisma";

// Format rupiah function
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default async function UserProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Group products by category
  const categories = products.reduce((acc, product) => {
    const category = product.category || "Lainnya";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #eaeaea",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <a
            href="/dashboard/user"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#000000",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              🍜
            </div>
            <div>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#000000",
                  margin: 0,
                  letterSpacing: "-0.3px",
                }}
              >
                FoodieDash
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b6b6b",
                  margin: "4px 0 0 0",
                }}
              >
                Our Menu
              </p>
            </div>
          </a>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Back Button - tanpa event handlers */}
          <a
            href="/dashboard/user"
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: "#404040",
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "16px" }}>←</span>
            Back to Dashboard
          </a>
          
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "10px",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "20px" }}>🛒</span>
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                backgroundColor: "#000000",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: 600,
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              0
            </span>
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#f5f5f5",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#404040",
              fontWeight: 600,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            U
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          {/* Breadcrumb Navigation - tanpa event handlers */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
              fontSize: "14px",
              color: "#8c8c8c",
            }}
          >
            <a
              href="/dashboard/user"
              style={{
                color: "#8c8c8c",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Dashboard
            </a>
            <span style={{ color: "#eaeaea" }}>/</span>
            <span style={{ color: "#000000", fontWeight: 500 }}>Products</span>
          </div>

          {/* Page Title */}
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#000000",
                margin: 0,
                marginBottom: "8px",
                letterSpacing: "-0.5px",
              }}
            >
              Our Menu
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#6b6b6b",
                margin: 0,
              }}
            >
              {products.length} delicious items available
            </p>
          </div>

          {/* Products Grid by Category */}
          {products.length > 0 ? (
            Object.keys(categories).map((category) => (
              <div key={category} style={{ marginBottom: "48px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#000000",
                      margin: 0,
                    }}
                  >
                    {category}
                  </h3>
                  <span
                    style={{
                      padding: "6px 16px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "20px",
                      fontSize: "13px",
                      color: "#404040",
                    }}
                  >
                    {categories[category].length} items
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "24px",
                  }}
                >
                  {categories[category].map((product) => (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #eaeaea",
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.2s",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Image Container */}
                      <div
                        style={{
                          width: "100%",
                          height: "200px",
                          backgroundColor: "#fafafa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderBottom: "1px solid #eaeaea",
                        }}
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "48px", color: "#cccccc" }}>🍽️</span>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ marginBottom: "12px" }}>
                          <h4
                            style={{
                              fontSize: "18px",
                              fontWeight: 600,
                              color: "#000000",
                              margin: 0,
                              marginBottom: "4px",
                            }}
                          >
                            {product.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#000000",
                              margin: 0,
                            }}
                          >
                            {formatRupiah(product.price)}
                          </p>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                          <span
                            style={{
                              padding: "4px 12px",
                              backgroundColor: "#f5f5f5",
                              borderRadius: "20px",
                              fontSize: "12px",
                              color: "#404040",
                              display: "inline-block",
                            }}
                          >
                            Stock: {product.stock}
                          </span>
                        </div>

                        <button
                          style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#000000",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            marginTop: "auto",
                          }}
                        >
                          <span>Add to Cart</span>
                          <span style={{ fontSize: "16px" }}>+</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 40px",
                backgroundColor: "#fafafa",
                borderRadius: "16px",
                border: "1px solid #eaeaea",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "24px" }}>🍽️</div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#000000",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                No products available
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b6b6b",
                  margin: 0,
                }}
              >
                Check back later for our delicious menu
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#fafafa",
          borderTop: "1px solid #eaeaea",
          padding: "48px 40px",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "40px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#000000",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                🍜
              </div>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#000000" }}>FoodieDash</span>
            </div>
            <p style={{ fontSize: "14px", color: "#6b6b6b", lineHeight: 1.6, margin: 0 }}>
              Delicious food delivered fast, fresh, and right to your door.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#000000", margin: "0 0 16px 0" }}>
              About
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b6b6b", cursor: "pointer" }}>About Us</span>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b6b6b", cursor: "pointer" }}>Careers</span>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b6b6b", cursor: "pointer" }}>Blog</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#000000", margin: "0 0 16px 0" }}>
              Support
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b6b6b", cursor: "pointer" }}>Contact Us</span>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b6b6b", cursor: "pointer" }}>FAQ</span>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b6b6b", cursor: "pointer" }}>Privacy Policy</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#000000", margin: "0 0 16px 0" }}>
              Follow Us
            </h4>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ fontSize: "20px", cursor: "pointer" }}>📘</span>
              <span style={{ fontSize: "20px", cursor: "pointer" }}>📸</span>
              <span style={{ fontSize: "20px", cursor: "pointer" }}>🐦</span>
            </div>
          </div>
        </div>
        <div
          style={{
            maxWidth: "1200px",
            margin: "40px auto 0",
            paddingTop: "32px",
            borderTop: "1px solid #eaeaea",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
            © 2024 FoodieDash. All rights reserved.
          </span>
          <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
            v1.0.0
          </span>
        </div>
      </footer>
    </div>
  );
}