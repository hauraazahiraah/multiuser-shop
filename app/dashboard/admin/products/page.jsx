"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Edit Product State
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("Makanan");
  const [editStock, setEditStock] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const formatRp = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/product");
      if (!res.ok) return;
      setProducts(await res.json());
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================= ADD =================
  const add = async () => {
    if (!name || !price || !stock) {
      alert("Name, price, and stock are required");
      return;
    }

    setIsAdding(true);
    try {
      let imageUrl = "";

      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const up = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const r = await up.json();
        imageUrl = r.url;
      }

      await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseInt(price),
          imageUrl,
          category,
          stock: parseInt(stock),
        }),
      });

      setName("");
      setPrice("");
      setCategory("Makanan");
      setStock("");
      setFile(null);

      load();
    } catch (error) {
      alert("Failed to add product");
    } finally {
      setIsAdding(false);
    }
  };

  // ================= DELETE =================
  const del = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      load();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  // ================= EDIT =================
  const openEdit = (p) => {
    setEditId(p.id);
    setEditName(p.name || "");
    setEditPrice(p.price?.toString() || "");
    setEditCategory(p.category || "Makanan");
    setEditStock(p.stock?.toString() || "");
    setEditFile(null);
  };

  const saveEdit = async () => {
    if (!editName || !editPrice || !editStock) {
      alert("Name, price, and stock are required");
      return;
    }

    setIsEditing(true);
    try {
      let imageUrl = undefined;

      if (editFile) {
        const fd = new FormData();
        fd.append("file", editFile);

        const up = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const r = await up.json();
        imageUrl = r.url;
      }

      await fetch(`/api/product/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          price: parseInt(editPrice),
          category: editCategory,
          stock: parseInt(editStock),
          ...(imageUrl && { imageUrl }),
        }),
      });

      setEditId(null);
      load();
    } catch (error) {
      alert("Failed to update product");
    } finally {
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditFile(null);
  };

  return (
    <div className="admin-products">
      {/* Main Content */}
      <main className="content">
        <div className="container">
          {/* Page Title */}
          <div className="page-header">
            <h2 className="page-title">MANAGE PRODUCTS</h2>
            <p className="page-subtitle">
              Add, edit, and remove food items from your menu
            </p>
          </div>

          {/* Add Product Form */}
          <div className="form-section">
            <h3 className="form-title">ADD NEW PRODUCT</h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Nasi Goreng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price (IDR) *</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Snack">Snack</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input
                  type="number"
                  placeholder="100"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Product Image</label>
                <div className="file-input-wrapper">
                  <label htmlFor="file-upload" className="file-button">
                    Choose File
                  </label>
                  <span className="file-name">
                    {file ? file.name : "No file chosen"}
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                onClick={add}
                disabled={isAdding}
                className="btn btn-primary"
              >
                {isAdding ? "Adding..." : "Add Product"} <span>+</span>
              </button>
            </div>
          </div>

          {/* Products List */}
          <div className="products-section">
            <div className="section-header">
              <h3 className="section-title">ALL PRODUCTS</h3>
              <span className="product-count">{products.length} items</span>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h4>No products yet</h4>
                <p>Add your first product to get started</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => (
                  <div key={p.id} className="product-card">
                    {p.imageUrl && (
                      <div className="product-image">
                        <img src={p.imageUrl} alt={p.name} />
                      </div>
                    )}

                    {editId === p.id ? (
                      <div className="edit-form">
                        <div className="edit-field">
                          <label>Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div className="edit-field">
                          <label>Price</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                          />
                        </div>
                        <div className="edit-field">
                          <label>Category</label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                          >
                            <option value="Makanan">Makanan</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Snack">Snack</option>
                            <option value="Dessert">Dessert</option>
                          </select>
                        </div>
                        <div className="edit-field">
                          <label>Stock</label>
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                          />
                        </div>
                        <div className="edit-field">
                          <label>New Image (optional)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditFile(e.target.files[0])}
                          />
                        </div>
                        <div className="edit-actions">
                          <button
                            onClick={saveEdit}
                            disabled={isEditing}
                            className="btn-save"
                          >
                            {isEditing ? "Saving..." : "Save"}
                          </button>
                          <button onClick={cancelEdit} className="btn-cancel">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="product-info">
                          <h4 className="product-name">{p.name}</h4>
                          <div className="product-price">
                            {formatRp(p.price)}
                          </div>
                          <div className="product-meta">
                            <span className="product-category">
                              {p.category || "Makanan"}
                            </span>
                            <span
                              className={`product-stock ${
                                (p.stock || 0) <= 5 ? "low" : ""
                              }`}
                            >
                              Stock: {p.stock ?? 0}
                            </span>
                          </div>
                        </div>
                        <div className="product-actions">
                          <button onClick={() => openEdit(p)} className="btn-edit">
                            Edit
                          </button>
                          <button onClick={() => del(p.id)} className="btn-delete">
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .admin-products {
          min-height: 100vh;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          display: flex;
          flex-direction: column;
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
          font-size: 15px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        /* FORM SECTION */
        .form-section {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 48px;
        }

        .form-title {
          font-size: 18px;
          font-weight: 800;
          color: #000;
          margin: 0 0 24px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #000;
          padding-bottom: 12px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #000;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 2px solid #000;
          border-radius: 8px;
          background: #fff;
          color: #000;
          outline: none;
          box-sizing: border-box;
          font-weight: 500;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #333;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }

        .file-input-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .file-button {
          padding: 12px 24px;
          background: #fff;
          color: #000;
          border: 2px solid #000;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .file-button:hover {
          background: #000;
          color: #fff;
        }

        .file-name {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .form-actions {
          margin-top: 32px;
        }

        .btn {
          padding: 14px 32px;
          background: #000;
          color: #fff;
          border: 2px solid #000;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .btn:disabled {
          background: #999;
          border-color: #999;
          cursor: not-allowed;
        }

        /* PRODUCTS SECTION */
        .products-section {
          background: #fff;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #000;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #000;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-count {
          padding: 6px 12px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #000;
        }

        /* Loading */
        .loading-state {
          text-align: center;
          padding: 60px;
          background: #fafafa;
          border: 1px solid #000;
          border-radius: 12px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #eaeaea;
          border-top: 3px solid #000;
          border-radius: 50%;
          margin: 0 auto 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          background: #fafafa;
          border: 1px solid #000;
          border-radius: 12px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h4 {
          font-size: 16px;
          font-weight: 700;
          color: #000;
          margin: 0 0 8px;
        }

        .empty-state p {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
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
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .product-image {
          width: 100%;
          height: 180px;
          background: #f5f5f5;
          border-bottom: 2px solid #000;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          padding: 20px;
          flex: 1;
        }

        .product-name {
          font-size: 18px;
          font-weight: 800;
          color: #000;
          margin: 0 0 8px;
        }

        .product-price {
          font-size: 20px;
          font-weight: 800;
          color: #000;
          margin: 0 0 12px;
        }

        .product-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .product-category {
          padding: 4px 12px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #000;
          text-transform: uppercase;
        }

        .product-stock {
          padding: 4px 12px;
          background: #f5f5f5;
          border: 1px solid #000;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #000;
        }

        .product-stock.low {
          background: #fff;
          border-color: #000;
          color: #000;
        }

        .product-actions {
          display: flex;
          gap: 8px;
          padding: 20px;
          padding-top: 0;
        }

        .btn-edit,
        .btn-delete {
          flex: 1;
          padding: 10px;
          border: 2px solid #000;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-edit {
          background: #fff;
          color: #000;
        }

        .btn-edit:hover {
          background: #000;
          color: #fff;
        }

        .btn-delete {
          background: #fff;
          color: #000;
        }

        .btn-delete:hover {
          background: #000;
          color: #fff;
        }

        /* Edit Form inside card */
        .edit-form {
          padding: 20px;
        }

        .edit-field {
          margin-bottom: 16px;
        }

        .edit-field label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #000;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .edit-field input,
        .edit-field select {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #000;
          border-radius: 6px;
          font-size: 14px;
          background: #fff;
          color: #000;
          font-weight: 500;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
          margin-top: 20px;
        }

        .btn-save,
        .btn-cancel {
          flex: 1;
          padding: 10px;
          border: 2px solid #000;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .btn-save {
          background: #000;
          color: #fff;
        }

        .btn-save:hover:not(:disabled) {
          background: #333;
        }

        .btn-save:disabled {
          background: #999;
          border-color: #999;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: #fff;
          color: #000;
        }

        .btn-cancel:hover {
          background: #000;
          color: #fff;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.full-width {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}