const express = require("express");
const cors = require("cors");

const app = express();
// Port ini sesuai dengan yang ada di main.js Frontend (API_BASE_URL)
const PORT = 8000;

// Middleware
app.use(cors()); // Izinkan akses (CORS) dari frontend
app.use(express.json()); // Mampu membaca request body JSON

// Import Routes
const dashboardRoutes = require("./routes/dashboard");
const produkRoutes = require("./routes/produk");
const authRoutes = require("./routes/auth");

// Gunakan Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api", authRoutes);
// Root URL tes
app.get("/", (req, res) => {
  res.send("API Backend SCM Garam sedang berjalan!");
});

// Mulai Server
app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
