const multer = require("multer");
const cloudinary = require("cloudinary").v2;
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

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

function verifyAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });

  try {
    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

app.post(
  "/upload",
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "garage-business" }
      );

      res.json({
        url: result.secure_url
      });
    } catch (err) {
      res.status(500).json({ error: "Upload failed" });
    }
  }
);


/* ---------------- Start Server ---------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
