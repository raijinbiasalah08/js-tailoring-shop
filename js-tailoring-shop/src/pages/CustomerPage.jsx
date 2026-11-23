import { useState, useEffect } from "react";

function CustomerPage({
  setPage,
  setCurrentUser,
  currentUser,
  services,
  selectedService,
  setSelectedService,
  successMessage,
  formData,
  setFormData,
  submitReservation,
  myReservations,
  fetchMyReservations,
}) {
  const [view, setView] = useState("services"); // "services" o "orders"

  useEffect(() => {
    fetchMyReservations();
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("login");
  };

  const orders = myReservations || [];

  return (
    <div className="app-shell">
      <nav className="topbar">
        <span className="topbar-brand">J&rsquo;s Tailoring Shop</span>
        <button className="btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <header className="hero">
        <h1>
          {currentUser ? `Kumusta, ${currentUser.name}!` : "Ano ang ipapatahi mo?"}
        </h1>
        <p>Piliin ang serbisyo, i-book, at kami na ang bahala sa tahi.</p>
      </header>

      <main className="page-container">
        <div className="admin-tabs" role="tablist" aria-label="Customer view">
          <button
            type="button"
            role="tab"
            aria-selected={view === "services"}
            className={`admin-tab ${view === "services" ? "active" : ""}`}
            onClick={() => setView("services")}
          >
            Mga Serbisyo
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "orders"}
            className={`admin-tab ${view === "orders" ? "active" : ""}`}
            onClick={() => {
              setView("orders");
              fetchMyReservations();
            }}
          >
            Aking mga Order
          </button>
        </div>

        {view === "services" && (
          <>
            <div className="service-grid">
              {services.map((service) => (
                <div className="service-card" key={service.id}>
                  <div className="service-image-wrap">
                    <img src={service.image} alt={service.name} />
                  </div>
                  <div className="service-body">
                    <h3>{service.name}</h3>
                    <p className="service-price">Simula sa ₱{service.price}</p>
                    <button
                      className="btn-primary w-full"
                      onClick={() => setSelectedService(service)}
                    >
                      Mag-reserve
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {successMessage && (
              <div className="success-banner" role="status">
                {successMessage}
              </div>
            )}

            {selectedService && (
              <div className="reservation-panel">
                <div className="reservation-panel-header">
                  <h2>Reserve Now: {selectedService.name}</h2>
                  <p>Possible Price: ₱{selectedService.price}</p>
                </div>

                <form onSubmit={submitReservation} className="reservation-form">
                  <label className="field-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="field-input"
                    placeholder="Buong pangalan"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />

                  <label className="field-label" htmlFor="contact">
                    Contact Number
                  </label>
                  <input
                    id="contact"
                    type="text"
                    className="field-input"
                    placeholder="0900 000 0000"
                    required
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                  />

                  <label className="field-label" htmlFor="details">
                    Details
                  </label>
                  <textarea
                    id="details"
                    className="field-input"
                    placeholder="Sabihin sa amin ang gusto mong itahi — sukat, kulay, tela, atbp."
                    rows="4"
                    required
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                  />

                  <label className="field-label" htmlFor="date">
                    Gustong Petsa ng Pick-up / Reserbasyon
                  </label>
                  <input
                    id="date"
                    type="date"
                    className="field-input"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      I-submit ang Reservation
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setSelectedService(null)}
                    >
                      Kanselahin
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {view === "orders" && (
          <section>
            <h2 className="section-title">Aking mga Reservation</h2>

            {orders.length === 0 ? (
              <p className="empty-state">Wala ka pang reservation.</p>
            ) : (
              <div className="reservation-table-wrap">
                <table className="reservation-table">
                  <thead>
                    <tr>
                      <th>Serbisyo</th>
                      <th>Detalye</th>
                      <th>Petsa</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((reservation) => {
                      const status = reservation.status || "Pending";
                      return (
                        <tr key={reservation.id}>
                          <td>{reservation.service}</td>
                          <td className="cell-details">{reservation.details}</td>
                          <td>{reservation.date}</td>
                          <td>
                            <span
                              className={`status-badge status-${status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default CustomerPage;