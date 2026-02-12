"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, loadCart, cartCount } = useCart();
  const [loading, setLoading] = useState(false);

  // Form data pelanggan
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shippingMethod: "JNE Regular",
    paymentMethod: "TRANSFER",
  });

  // Shipping cost dummy
  const shippingCost = 15000;

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      alert("Nama, nomor HP, dan alamat wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subtotal,
          shippingCost,
          total,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            subtotal: item.product.price * item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect ke halaman struk
        router.push(`/dashboard/user/order/${data.orderNumber}`);
      } else {
        alert(data.error || "Checkout gagal");
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>Checkout</h1>
        <p>Cart kosong, yuk belanja dulu!</p>
        <button onClick={() => router.push("/dashboard/user/products")}>
          Lihat Produk
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Checkout</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32 }}>
        {/* FORM DATA PELANGGAN */}
        <div>
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              border: "1px solid #eaeaea",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
              1. Data Penerima
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  Nama Lengkap <span style={{ color: "#cf1322" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  No. WhatsApp <span style={{ color: "#cf1322" }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="081234567890"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  Alamat Lengkap <span style={{ color: "#cf1322" }}>*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                    resize: "vertical",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  Kurir Pengiriman
                </label>
                <select
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                  }}
                >
                  <option value="JNE Regular">JNE Regular (2-3 hari) - Rp 15.000</option>
                  <option value="J&T Express">J&T Express (2-3 hari) - Rp 15.000</option>
                  <option value="SiCepat REG">SiCepat REG (2-3 hari) - Rp 15.000</option>
                  <option value="GoSend Same Day">GoSend Same Day - Rp 25.000</option>
                </select>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 600, margin: "24px 0 20px" }}>
                2. Metode Pembayaran
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="TRANSFER"
                    checked={formData.paymentMethod === "TRANSFER"}
                    onChange={handleInputChange}
                  />
                  <div>
                    <strong style={{ fontSize: 15 }}>Transfer Bank (BCA/Mandiri/BRI)</strong>
                    <p style={{ fontSize: 13, color: "#6b6b6b", margin: "4px 0 0" }}>
                      Bayar via virtual account atau transfer manual
                    </p>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="EWALLET"
                    checked={formData.paymentMethod === "EWALLET"}
                    onChange={handleInputChange}
                  />
                  <div>
                    <strong style={{ fontSize: 15 }}>E-Wallet (OVO/GoPay/DANA)</strong>
                    <p style={{ fontSize: 13, color: "#6b6b6b", margin: "4px 0 0" }}>
                      Bayar pakai dompet digital
                    </p>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                  />
                  <div>
                    <strong style={{ fontSize: 15 }}>Cash on Delivery (COD)</strong>
                    <p style={{ fontSize: 13, color: "#6b6b6b", margin: "4px 0 0" }}>
                      Bayar tunai saat barang sampai
                    </p>
                  </div>
                </label>
              </div>

              {/* TOMBOL BUAT PESANAN - INI YANG SEBELUMNYA TIDAK ADA! */}
              <div style={{ marginTop: 32 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: loading ? "#8c8c8c" : "#000000",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Memproses..." : "Buat Pesanan"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SIDEBAR - RINGKASAN ORDER */}
        <div>
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              border: "1px solid #eaeaea",
              position: "sticky",
              top: 100,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
              Ringkasan Belanja
            </h3>

            <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 16 }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      background: "#f5f5f5",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt=""
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                      />
                    ) : (
                      <span>🍽️</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
                      {item.product.name}
                    </p>
                    <p style={{ fontSize: 12, color: "#6b6b6b", margin: "4px 0 0" }}>
                      {item.quantity} x {formatRupiah(item.product.price)}
                    </p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                    {formatRupiah(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #eaeaea", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#6b6b6b" }}>Subtotal</span>
                <span style={{ fontWeight: 500 }}>{formatRupiah(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#6b6b6b" }}>Ongkos Kirim</span>
                <span style={{ fontWeight: 500 }}>{formatRupiah(shippingCost)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid #eaeaea",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#000" }}>
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard/user/cart")}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: 24,
                backgroundColor: "transparent",
                color: "#404040",
                border: "1px solid #eaeaea",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              ← Kembali ke Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}