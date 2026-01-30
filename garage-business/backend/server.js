const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------- Middleware ---------- */
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

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/products", (req, res) => {
  // temporary mock data (DB comes later)
  res.json([]);
});

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
