import prisma from "@/lib/prisma";

export default async function OrderDetail({ params }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return (
      <div className="not-found-container">
        <div className="not-found-card">
          <div className="not-found-icon">🔍</div>
          <h1 className="not-found-title">PESANAN TIDAK DITEMUKAN</h1>
          <p className="not-found-message">
            Maaf, pesanan dengan ID <strong>{id}</strong> tidak dapat ditemukan.
          </p>
          <a href="/dashboard/admin/orders" className="back-btn">
            ← KEMBALI KE DAFTAR PESANAN
          </a>
        </div>
        <style>{`
          .not-found-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .not-found-card {
            background: white;
            border: 2px solid #000;
            border-radius: 12px;
            padding: 50px 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          .not-found-icon {
            font-size: 60px;
            margin-bottom: 25px;
            color: #000;
          }
          .not-found-title {
            font-size: 28px;
            font-weight: 800;
            color: #000;
            margin: 0 0 15px 0;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .not-found-message {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
            font-weight: 500;
          }
          .back-btn {
            display: inline-block;
            padding: 14px 28px;
            background: #000;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 700;
            border: 2px solid #000;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .back-btn:hover {
            background: #333;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </div>
    );
  }

  // Format currency
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  return (
    <div className="order-detail-container">
      <div className="order-detail-card">
        {/* Header */}
        <div className="detail-header">
          <h1 className="detail-title">DETAIL PESANAN</h1>
          <div className="order-id">#ORD-{order.id.toString().padStart(5, "0")}</div>
        </div>

        {/* Info Grid */}
        <div className="info-grid">
          {/* Customer Info */}
          <div className="info-section">
            <h2 className="section-title">INFORMASI PELANGGAN</h2>
            <div className="info-row">
              <span className="info-label">Nama</span>
              <span className="info-value">{order.customerName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{order.customerEmail}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Telepon</span>
              <span className="info-value">{order.customerPhone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Alamat</span>
              <span className="info-value">{order.customerAddress}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="info-section">
            <h2 className="section-title">INFORMASI PEMBAYARAN</h2>
            <div className="info-row">
              <span className="info-label">Metode</span>
              <span className="info-value">{order.paymentMethod}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status</span>
              <span className="info-value">
                <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                  {order.paymentStatus}
                </span>
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Tanggal</span>
              <span className="info-value">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="items-section">
          <h2 className="section-title">DAFTAR PRODUK</h2>
          <div className="items-table">
            <div className="items-header">
              <div>PRODUK</div>
              <div>QTY</div>
              <div className="text-right">HARGA</div>
              <div className="text-right">SUBTOTAL</div>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className="item-row">
                <div>
                  <div className="product-name">{item.product.name}</div>
                  {item.product.sku && <div className="product-sku">SKU: {item.product.sku}</div>}
                </div>
                <div className="item-qty">{item.quantity}</div>
                <div className="item-price">{formatRupiah(item.price)}</div>
                <div className="item-subtotal">{formatRupiah(item.subtotal)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="summary-section">
          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span className="summary-value">{formatRupiah(order.total)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Biaya Pengiriman</span>
            <span className="summary-value">{formatRupiah(order.shippingCost || 0)}</span>
          </div>
          <div className="summary-row grand-total">
            <span className="summary-label">TOTAL</span>
            <span className="summary-value">{formatRupiah(order.total + (order.shippingCost || 0))}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="detail-footer">
          <div className="footer-note">Terima kasih telah berbelanja di Toko Serba Ada</div>
          <div className="footer-copy">© {new Date().getFullYear()} • Dokumen ini sah tanpa tanda tangan</div>
        </div>
      </div>

      {/* Global Styles untuk halaman ini */}
      <style>{`
        .order-detail-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
          padding: 30px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .order-detail-card {
          background: white;
          width: 100%;
          max-width: 1000px;
          border: 2px solid #000;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .detail-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 25px;
          border-bottom: 2px solid #000;
        }

        .detail-title {
          font-size: 32px;
          font-weight: 800;
          color: #000;
          margin: 0 0 10px 0;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .order-id {
          font-size: 18px;
          font-weight: 700;
          color: #666;
          background: #f5f5f5;
          display: inline-block;
          padding: 8px 25px;
          border-radius: 40px;
          border: 1px solid #000;
        }

        /* Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .info-section {
          background: #f9f9f9;
          border: 1px solid #000;
          border-radius: 8px;
          padding: 25px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #000;
          margin: 0 0 20px 0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border-bottom: 1px solid #000;
          padding-bottom: 10px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 15px;
        }

        .info-label {
          font-weight: 700;
          color: #000;
          min-width: 80px;
        }

        .info-value {
          font-weight: 500;
          color: #333;
          text-align: right;
          flex: 1;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
        }

        .status-badge.success,
        .status-badge.paid,
        .status-badge.completed {
          background: #000;
          color: white;
        }

        .status-badge.pending {
          background: #f0f0f0;
          color: #000;
          border: 1px solid #000;
        }

        .status-badge.failed,
        .status-badge.cancelled {
          background: #fff;
          color: #000;
          border: 1px solid #000;
        }

        /* Items Section */
        .items-section {
          margin-bottom: 40px;
        }

        .items-table {
          border: 2px solid #000;
          border-radius: 8px;
          overflow: hidden;
        }

        .items-header {
          display: grid;
          grid-template-columns: 3fr 1fr 1.5fr 1.5fr;
          background: #000;
          color: white;
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 15px 20px;
        }

        .items-header .text-right {
          text-align: right;
        }

        .item-row {
          display: grid;
          grid-template-columns: 3fr 1fr 1.5fr 1.5fr;
          padding: 15px 20px;
          border-bottom: 1px solid #000;
          background: white;
          transition: background 0.2s;
        }

        .item-row:hover {
          background: #f5f5f5;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .product-name {
          font-size: 16px;
          color: #000;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .product-sku {
          font-size: 12px;
          color: #666;
          font-weight: 400;
        }

        .item-qty,
        .item-price,
        .item-subtotal {
          font-weight: 700;
          color: #000;
          display: flex;
          align-items: center;
        }

        .item-price,
        .item-subtotal {
          justify-content: flex-end;
        }

        /* Summary */
        .summary-section {
          background: #f9f9f9;
          border: 2px solid #000;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 30px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .summary-label {
          font-weight: 600;
          color: #666;
        }

        .summary-value {
          font-weight: 700;
          color: #000;
        }

        .grand-total {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #000;
          font-size: 20px;
        }

        .grand-total .summary-label,
        .grand-total .summary-value {
          font-weight: 800;
          color: #000;
        }

        /* Footer */
        .detail-footer {
          text-align: center;
          padding-top: 25px;
          border-top: 1px solid #000;
          color: #666;
          font-size: 14px;
        }

        .footer-note {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .footer-copy {
          font-size: 12px;
          color: #999;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .order-detail-container {
            padding: 20px;
          }
          .order-detail-card {
            padding: 25px;
          }
          .detail-title {
            font-size: 26px;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .items-header,
          .item-row {
            grid-template-columns: 2fr 0.8fr 1fr 1fr;
            font-size: 13px;
            padding: 12px;
          }
          .product-name {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .order-detail-card {
            padding: 20px;
          }
          .items-header,
          .item-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .items-header {
            display: none;
          }
          .item-row {
            border: 1px solid #000;
            margin-bottom: 10px;
            border-radius: 6px;
          }
          .product-name,
          .item-qty,
          .item-price,
          .item-subtotal {
            display: flex;
            justify-content: space-between;
          }
          .item-qty::before {
            content: "Qty: ";
            font-weight: 600;
            color: #666;
          }
          .item-price::before {
            content: "Harga: ";
            font-weight: 600;
            color: #666;
          }
          .item-subtotal::before {
            content: "Subtotal: ";
            font-weight: 600;
            color: #666;
          }
        }
      `}</style>
    </div>
  );
}