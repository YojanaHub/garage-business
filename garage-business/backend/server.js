const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

/* ---------------- Middleware ---------------- */
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://garage-business.vercel.app"
    ],
    credentials: true
  })
);

/* ---------------- Config ---------------- */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

/* ---------------- Routes ---------------- */
app.get("/", (req, res) => {
  res.send("OK");
});

/* Products (temporary, DB later) */
app.get("/products", (req, res) => {
  res.json([]);
});

/* Admin Login */
app.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password required" });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token });
});

/* ---------------- Start Server ---------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
