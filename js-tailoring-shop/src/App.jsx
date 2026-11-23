import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import CustomerPage from "./pages/CustomerPage";
import AdminPage from "./pages/AdminPage";
import ProductsTable from "./components/ProductsTable";
import initialServices from "./data/serviceData";

// FIREBASE
import { auth, googleProvider, db } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const ADMIN_EMAILS = ["sherwinmarino06@gmail.com"];
const API = "http://localhost:5000/api";

function App() {
  // naka-save sa sessionStorage para hindi mawala kapag nag-type ng URL (reload)
  const [adminLoggedIn, setAdminLoggedIn] = useState(
    () => sessionStorage.getItem("isAdmin") === "true"
  );
  const [page, setPage] = useState(() =>
    sessionStorage.getItem("isAdmin") === "true" ? "admin" : "login"
  );

  const [loginType, setLoginType] = useState("customer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [reservations, setReservations] = useState([]);
  const [myReservations, setMyReservations] = useState([]);

  const [services, setServices] = useState(initialServices);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [adminView, setAdminView] = useState("services");
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    name: "",
    price: "",
    image: "",
  });
  const [addServiceError, setAddServiceError] = useState("");

  const STATUS_STEPS = ["Pending", "Ginagawa", "Tapos na"];

  // Binabago ang status sa backend, tapos sa screen
  const advanceStatus = async (id) => {
    const current = reservations.find((r) => r.id === id);
    if (!current) return;

    const nextIndex =
      (STATUS_STEPS.indexOf(current.status) + 1) % STATUS_STEPS.length;
    const next = STATUS_STEPS[nextIndex];

    try {
      const res = await fetch(`${API}/reservations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: next } : r))
        );
      }
    } catch (err) {
      console.error("Hindi nabago ang status:", err);
    }
  };

  const pendingCount = reservations.filter((r) => r.status === "Pending").length;

  const addService = (e) => {
    e.preventDefault();
    setAddServiceError("");

    if (!newServiceForm.name.trim() || !newServiceForm.price) {
      setAddServiceError("Kailangan ang pangalan at presyo ng produkto.");
      return;
    }

    const newService = {
      id: Date.now(),
      name: newServiceForm.name.trim(),
      price: Number(newServiceForm.price),
      image:
        newServiceForm.image.trim() ||
        "https://placehold.co/600x450/e9dfcf/8a7c6a?text=Walang+Larawan",
    };

    setServices((prev) => [...prev, newService]);
    setNewServiceForm({ name: "", price: "", image: "" });
    setIsAddingService(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    details: "",
    date: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3500);
    return () => clearTimeout(t);
  }, [successMessage]);

  // ADMIN: kunin ang lahat ng reservation, i-refresh kada 5 segundo
  useEffect(() => {
    if (page !== "admin") return;

    const loadAll = () => {
      fetch(`${API}/reservations`)
        .then((res) => res.json())
        .then((data) => setReservations(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Hindi nakuha ang reservations:", err));
    };

    loadAll();
    const timer = setInterval(loadAll, 5000);
    return () => clearInterval(timer);
  }, [page]);

  // admin login/logout helpers
  const loginAsAdmin = () => {
    sessionStorage.setItem("isAdmin", "true");
    setAdminLoggedIn(true);
    setPage("admin");
  };

  const logout = () => {
    sessionStorage.removeItem("isAdmin");
    setAdminLoggedIn(false);
    setPage("login");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(
      "For admin access, sign in with the authorized Google account below."
    );
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Hindi makapag-login.");
        return;
      }

      setCurrentUser(data);
      setUsername("");
      setPassword("");
      setPage("customer");
    } catch (err) {
      setLoginError("Hindi makonekta sa server. Siguraduhing gumagana ang backend.");
    }
  };

  const handleRegister = async ({ name, username, password }) => {
    setLoginError("");

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Hindi nagawa ang account.");
        return;
      }

      setCurrentUser(data);
      setPage("customer");
    } catch (err) {
      setLoginError("Hindi makonekta sa server. Siguraduhing gumagana ang backend.");
    }
  };

  // FIREBASE GOOGLE LOGIN (may Firestore save at admin check na)
  const handleGoogleLogin = async () => {
    setLoginError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;

      const isAdmin = ADMIN_EMAILS.includes(gUser.email);

      // i-save/i-update ang user info sa Firestore "users" collection
      await setDoc(
        doc(db, "users", gUser.uid),
        {
          displayName: gUser.displayName,
          email: gUser.email,
          photoURL: gUser.photoURL,
          role: isAdmin ? "admin" : "customer",
          createdAt: serverTimestamp(),
        },
        { merge: true } // para hindi ma-overwrite ang existing data pag nag-login ulit
      );

      setCurrentUser({
        id: gUser.uid,
        name: gUser.displayName,
        email: gUser.email,
      });

      if (isAdmin) {
        loginAsAdmin();
      } else {
        setPage("customer");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setLoginError("Hindi nagawa ang Google sign-in. Subukan ulit.");
    }
  };

  // CUSTOMER: kunin ang sariling reservation
  const fetchMyReservations = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API}/reservations/${currentUser.id}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setMyReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Hindi nakuha ang reservations:", err);
    }
  };

  const submitReservation = async (e) => {
    e.preventDefault();

    const newReservation = {
      userId: currentUser.id,
      customerName: formData.name,
      contact: formData.contact,
      service: selectedService.name,
      details: formData.details,
      date: formData.date,
    };

    try {
      const res = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReservation),
      });

      if (!res.ok) throw new Error("Hindi na-save");

      setSuccessMessage(
        `Nareserve na ang "${selectedService.name}". Tatawag kami sa number na binigay mo pag tapos na.`
      );

      setFormData({ name: "", contact: "", details: "", date: "" });
      setSelectedService(null);
      fetchMyReservations();
    } catch (err) {
      setSuccessMessage("May problema sa pag-reserve. Subukan ulit.");
    }
  };

  // Ang pangunahing page (login / customer / admin) sa "/"
  let mainView = null;

  if (page === "login") {
    mainView = (
      <LoginPage
        loginType={loginType}
        setLoginType={setLoginType}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        loginError={loginError}
        setLoginError={setLoginError}
        handleLogin={handleLogin}
        handleCustomerLogin={handleCustomerLogin}
        handleRegister={handleRegister}
        handleGoogleLogin={handleGoogleLogin}
      />
    );
  } else if (page === "customer") {
    mainView = (
      <CustomerPage
        setPage={setPage}
        setCurrentUser={setCurrentUser}
        currentUser={currentUser}
        services={services}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        successMessage={successMessage}
        formData={formData}
        setFormData={setFormData}
        submitReservation={submitReservation}
        myReservations={myReservations}
        fetchMyReservations={fetchMyReservations}
      />
    );
  } else if (page === "admin") {
    mainView = (
      <AdminPage
        setPage={setPage}
        onLogout={logout}
        adminView={adminView}
        setAdminView={setAdminView}
        pendingCount={pendingCount}
        isAddingService={isAddingService}
        setIsAddingService={setIsAddingService}
        addServiceError={addServiceError}
        setAddServiceError={setAddServiceError}
        newServiceForm={newServiceForm}
        setNewServiceForm={setNewServiceForm}
        addService={addService}
        services={services}
        setServices={setServices}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        reservations={reservations}
        advanceStatus={advanceStatus}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={mainView} />

      {/* /products: admin lang. Kapag hindi naka-login bilang admin, ibabalik sa login */}
      <Route
        path="/products"
        element={adminLoggedIn ? <ProductsTable /> : <Navigate to="/" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
