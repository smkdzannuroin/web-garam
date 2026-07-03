const express = require("express");
const router = express.Router();
const db = require("../db");

// Endpoint: GET /api/produk
router.get("/", async (req, res) => {
  try {
    let rows = [];
    try {
      // Mengambil daftar produk beserta total stoknya dari tabel stok_gudang
      const [result] = await db.query(`
        SELECT p.*, IFNULL(SUM(s.jumlah_stok_ton), 0) as stok 
        FROM produk p 
        LEFT JOIN stok_gudang s ON p.id = s.id_produk 
        GROUP BY p.id
      `);
      rows = result;
    } catch (err) {
      // Fallback: Jika tabel stok_gudang tidak tersedia, ambil data produk saja
      const [result] = await db.query("SELECT *, 0 as stok FROM produk");
      rows = result;
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetch produk:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data produk" });
  }
});
// Endpoint: POST /api/produk
router.post("/", async (req, res) => {
  try {
    const { nama_produk, kategori, harga_per_kg, stok, deskripsi } = req.body;

    const [result] = await db.query(
      `INSERT INTO produk
      (nama_produk, kategori, harga_per_kg, deskripsi)
      VALUES (?, ?, ?, ?)`,
      [nama_produk, kategori, harga_per_kg, deskripsi],
    );

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error tambah produk:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan produk",
    });
  }
});
// Endpoint: POST /api/produk
router.post("/", async (req, res) => {
  try {
    const { nama_produk, kategori, harga, setok, setatus } = req.body;

    const [result] = await db.query(
      `INSERT INTO produk
      (nama_produk, kategori, harga, setok, setatus)
      VALUES (?, ?, ?, ?, ?)`,
      [nama_produk, kategori, harga, setok, setatus],
    );

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan produk",
    });
  }
});
module.exports = router;
