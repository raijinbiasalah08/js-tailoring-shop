import { useState, useEffect } from "react";

const PRODUCT_URL = "http://localhost:5000/api/products";
const emptyForm = { name: "", price: "", image: "" };

export default function AdminPage({
  onLogout,
  pendingCount = 0,
  reservations = [],
  advanceStatus,
}) {
  const [activeTab, setActiveTab] = useState("service");
  const [products, setProducts] = useState([]);
  const [productError, setProductError] = useState("");

  // modal para sa Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const loadProducts = () => {
    fetch(PRODUCT_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setProductError("");
      })
      .catch(() => setProductError("Hindi makonekta sa backend (port 5000)."));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  function handleLogout() {
    onLogout();
  }

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  }

  function openEdit(product) {
    setEditId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setFormError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.price) {
      setFormError("Kailangan ang pangalan at presyo.");
      return;
    }

    const url = editId ? `${PRODUCT_URL}/${editId}` : PRODUCT_URL;
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: form.price,
          image: form.image,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "May nangyaring mali.");
        return;
      }

      setShowModal(false);
      loadProducts();
    } catch (err) {
      setFormError("Hindi makonekta sa backend (port 5000).");
    }
  }

  const statusClass = (status) => {
    if (status === "Tapos na") return "bg-success";
    if (status === "Ginagawa") return "bg-info text-dark";
    return "bg-warning text-dark";
  };

  return (
    <div className="admin-page">
      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #f5efe6;
          font-family: "Segoe UI", system-ui, sans-serif;
          color: #2b1a1e;
        }
        .admin-nav {
          background: linear-gradient(90deg, #5c1a2b, #7a2a3d);
          color: #fff;
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .admin-nav h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 1.4rem;
        }
        .admin-nav .gold { color: #d4a95a; }
        .admin-hero { text-align: center; padding: 36px 16px 8px; }
        .admin-hero h1 {
          font-family: Georgia, serif;
          font-weight: 700;
          color: #5c1a2b;
          margin-bottom: 6px;
        }
        .admin-hero p { color: #7a6a6e; margin: 0; }
        .admin-tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 24px auto;
          padding: 6px;
          width: fit-content;
          background: #e8dccb;
          border-radius: 12px;
        }
        .admin-tab {
          border: none;
          background: transparent;
          padding: 10px 28px;
          border-radius: 8px;
          font-weight: 600;
          color: #7a6a6e;
          transition: all 0.2s ease;
        }
        .admin-tab:hover { color: #5c1a2b; }
        .admin-tab.active {
          background: #5c1a2b;
          color: #fff;
          box-shadow: 0 2px 6px rgba(92, 26, 43, 0.35);
        }
        .admin-content {
          max-width: 1100px;
          margin: 0 auto 48px;
          padding: 0 16px;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 20px 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
          border-left: 6px solid #d4a95a;
        }
        .stat-card .label {
          color: #7a6a6e;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-card .value {
          font-family: Georgia, serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #5c1a2b;
        }
        .panel {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
        }
        .panel-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .panel-head h3 {
          margin: 0;
          font-family: Georgia, serif;
          color: #5c1a2b;
        }
        .btn-gold {
          background: #d4a95a;
          border: none;
          color: #2b1a1e;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 8px;
        }
        .btn-gold:hover { background: #c4973f; }
        .btn-maroon {
          background: #5c1a2b;
          border: none;
          color: #fff;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 8px;
        }
        .btn-maroon:hover { background: #7a2a3d; color: #fff; }
        .mini-product {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #efe6d8;
        }
        .mini-product:last-child { border-bottom: none; }
        .mini-product img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 8px;
          background: #eee;
        }
        .mini-product .name { font-weight: 600; }
        .mini-product .price {
          margin-left: auto;
          color: #5c1a2b;
          font-weight: 700;
          margin-right: 8px;
        }
        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1040;
        }
        .modal-wrap {
          position: fixed;
          inset: 0;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-box {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        .modal-box h4 {
          font-family: Georgia, serif;
          color: #5c1a2b;
          margin-bottom: 16px;
        }
      `}</style>

      {/* NAVBAR */}
      <header className="admin-nav">
        <h2>
          J's Tailoring Shop <span className="gold">· Admin</span>
        </h2>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* HERO */}
      <section className="admin-hero">
        <h1>Admin Dashboard</h1>
        <p>Bantayan ang shop: mga produkto at mga order ng customer.</p>
      </section>

      {/* TABS */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "service" ? "active" : ""}`}
          onClick={() => setActiveTab("service")}
        >
          Service
        </button>
        <button
          className={`admin-tab ${activeTab === "order" ? "active" : ""}`}
          onClick={() => setActiveTab("order")}
        >
          Order{" "}
          {pendingCount > 0 && <span className="badge bg-danger">{pendingCount}</span>}
        </button>
      </div>

      <main className="admin-content">
        {/* SUMMARY CARDS */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">Kabuuang Produkto</div>
            <div className="value">{products.length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Pending na Order</div>
            <div className="value">{pendingCount}</div>
          </div>
          <div className="stat-card">
            <div className="label">Kabuuang Order</div>
            <div className="value">{reservations.length}</div>
          </div>
        </div>

        {/* SERVICE TAB */}
        {activeTab === "service" && (
          <div className="panel">
            <div className="panel-head">
              <h3>Mga Produkto</h3>
              <button className="btn-gold" onClick={openAdd}>
                + Magdagdag ng Produkto
              </button>
            </div>

            {productError && (
              <div className="alert alert-danger">{productError}</div>
            )}

            {products.length === 0 && !productError && (
              <p className="text-muted mb-0">Wala pang produkto.</p>
            )}

            {products.map((p) => (
              <div className="mini-product" key={p.id}>
                <img src={p.image} alt={p.name} />
                <span className="name">{p.name}</span>
                <span className="price">₱{Number(p.price).toLocaleString()}</span>
                <button className="btn-maroon" onClick={() => openEdit(p)}>
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}


        {activeTab === "order" && (
          <div className="panel">
            <div className="panel-head">
              <h3>Mga Order</h3>
            </div>

            {reservations.length === 0 ? (
              <p className="text-muted mb-0">Wala pang orders.</p>
            ) : (
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Petsa</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td>{r.customerName || r.name}</td>
                      <td>{r.service}</td>
                      <td>{r.date}</td>
                      <td>
                        <span className={`badge ${statusClass(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => advanceStatus(r.id)}
                        >
                          Next Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>


      {showModal && (
        <>
          <div className="modal-backdrop-custom" onClick={closeModal}></div>
          <div className="modal-wrap">
            <div className="modal-box">
              <h4>{editId ? "I-edit ang Produkto" : "Magdagdag ng Produkto"}</h4>

              {formError && <div className="alert alert-danger">{formError}</div>}

              <form onSubmit={handleSubmit}>
                <label htmlFor="name" className="form-label">
                  Pangalan
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control mb-3"
                  value={form.name}
                  onChange={handleChange}
                />

                <label htmlFor="price" className="form-label">
                  Presyo
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control mb-3"
                  value={form.price}
                  onChange={handleChange}
                />

                <label htmlFor="image" className="form-label">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  className="form-control mb-3"
                  value={form.image}
                  onChange={handleChange}
                />

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeModal}
                  >
                    Kanselahin
                  </button>
                  <button type="submit" className="btn-gold">
                    {editId ? "I-save" : "Idagdag"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
