import React, { useEffect, useState } from "react";

/* =======================
   ENV CONFIG
======================= */
const API = import.meta.env.VITE_API_URL;
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER;
const MAP_LINK = import.meta.env.VITE_MAP_LINK;
const YOUTUBE_LINK = import.meta.env.VITE_YOUTUBE_LINK;

/* =======================
   TRANSLATIONS
======================= */
const translations = {
  en: {
    title: "Garage Business",
    subtitle: "Iron, Cement & Custom Machinery Works",
    aboutTitle: "About Us",
    aboutText:
      "We are a local home-based garage business with years of hands-on experience in iron works, cement products, and custom machinery. Every product is built with care and strength.",
    search: "Search products...",
    enquire: "Enquire on WhatsApp",
    price: "Price",
    call: "Call for Price",
    adminLogin: "Admin Login",
    logout: "Logout",
    addProduct: "Add / Edit Product",
    name: "Product name",
    category: "Category",
    save: "Save",
    remove: "Remove",
    edit: "Edit",
    login: "Login",
    password: "Admin Password"
  },
  kn: {
    title: "ಗ್ಯಾರೇಜ್ ಉದ್ಯಮ",
    subtitle: "ಐರನ್, ಸಿಮೆಂಟ್ ಮತ್ತು ಕಸ್ಟಮ್ ಯಂತ್ರಗಳ ಕೆಲಸ",
    aboutTitle: "ನಮ್ಮ ಬಗ್ಗೆ",
    aboutText:
      "ನಾವು ಸ್ಥಳೀಯ ಗೃಹಾಧಾರಿತ ಗ್ಯಾರೇಜ್ ಉದ್ಯಮ. ಐರನ್ ಕೆಲಸ, ಸಿಮೆಂಟ್ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಕಸ್ಟಮ್ ಯಂತ್ರಗಳಲ್ಲಿ ಅನುಭವ ಹೊಂದಿದ್ದೇವೆ.",
    search: "ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...",
    enquire: "ವಾಟ್ಸಾಪ್ ಮೂಲಕ ವಿಚಾರಿಸಿ",
    price: "ಬೆಲೆ",
    call: "ಬೆಲೆಗಾಗಿ ಕರೆ ಮಾಡಿ",
    adminLogin: "ನಿರ್ವಹಣಾಧಿಕಾರಿ ಲಾಗಿನ್",
    logout: "ಲಾಗ್ ಔಟ್",
    addProduct: "ಉತ್ಪನ್ನ ಸೇರಿಸಿ / ತಿದ್ದು",
    name: "ಉತ್ಪನ್ನದ ಹೆಸರು",
    category: "ವರ್ಗ",
    save: "ಉಳಿಸಿ",
    remove: "ತೆಗೆದುಹಾಕಿ",
    edit: "ತಿದ್ದು",
    login: "ಲಾಗಿನ್",
    password: "ಪಾಸ್‌ವರ್ಡ್"
  }
};

export default function App() {
  /* =======================
     STATE
  ======================= */
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const isAdmin = Boolean(token);
  const isAdminRoute = window.location.pathname === "/admin";

  const [password, setPassword] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "Iron / Aluminium",
    price: "",
    image: "",
    callOnly: false
  });
  const [editingId, setEditingId] = useState(null);

  /* =======================
     LOAD PRODUCTS
  ======================= */
  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  /* =======================
     ADMIN LOGIN
  ======================= */
  const login = async () => {
    const res = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  /* =======================
     CLOUDINARY UPLOAD (ADMIN ONLY)
  ======================= */
  const uploadImage = async e => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);

    const res = await fetch(`${API}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });

    const json = await res.json();
    setForm({ ...form, image: json.url });
  };

  /* =======================
     SAVE PRODUCT
  ======================= */
  const saveProduct = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API}/products/${editingId}`
      : `${API}/products`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    setForm({
      name: "",
      category: "Iron / Aluminium",
      price: "",
      image: "",
      callOnly: false
    });
    setEditingId(null);

    const res = await fetch(`${API}/products`);
    setProducts(await res.json());
  };

  const removeProduct = async id => {
    await fetch(`${API}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(products.filter(p => p._id !== id));
  };

  /* =======================
     FILTER
  ======================= */
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =======================
     UI
  ======================= */
  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "auto" }}>
      {/* HEADER */}
      <h1>{t.title}</h1>
      <p>{t.subtitle}</p>

      <button onClick={() => setLang("en")}>EN</button>
      <button onClick={() => setLang("kn")}>ಕನ್ನಡ</button>

      {/* ABOUT */}
      <section style={{ marginTop: 30 }}>
        <h2>{t.aboutTitle}</h2>
        <p>{t.aboutText}</p>
      </section>

      {/* SEARCH */}
      <input
        placeholder={t.search}
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", marginTop: 20 }}
      />

      {/* PRODUCTS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 20, marginTop: 20 }}>
        {filtered.map(p => (
          <div key={p._id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <img src={p.image} alt="" style={{ width: "100%" }} />
            <h3>{p.name}</h3>
            <p>{p.category}</p>
            <strong>{p.callOnly ? t.call : `₹ ${p.price}`}</strong>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Interested in ${p.name}`}
              target="_blank"
            >
              <button>{t.enquire}</button>
            </a>

            {isAdmin && (
              <>
                <button onClick={() => { setEditingId(p._id); setForm(p); }}>{t.edit}</button>
                <button onClick={() => removeProduct(p._id)}>{t.remove}</button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ADMIN PANEL */}
      {isAdmin && (
        <section style={{ marginTop: 40 }}>
          <h2>{t.addProduct}</h2>
          <input placeholder={t.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder={t.price} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <input type="file" onChange={uploadImage} />
          <label>
            <input type="checkbox" checked={form.callOnly} onChange={e => setForm({ ...form, callOnly: e.target.checked })} />
            {t.call}
          </label>
          <button onClick={saveProduct}>{t.save}</button>
          <button onClick={logout}>{t.logout}</button>
        </section>
      )}

      {/* ADMIN LOGIN */}
      {isAdminRoute && !isAdmin && (
        <section>
          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={login}>{t.login}</button>
        </section>
      )}

      {/* FLOATING LINKS */}
      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        {MAP_LINK && <a href={MAP_LINK} target="_blank">📍 Map</a>}
        {YOUTUBE_LINK && <a href={YOUTUBE_LINK} target="_blank">▶ YouTube</a>}
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank">💬 WhatsApp</a>
      </div>
    </div>
  );
}
