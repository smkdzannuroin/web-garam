const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint: GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    // 1. Hitung Total Produk
    const [produkRows] = await db.query('SELECT COUNT(*) as total FROM produk');
    const total_produk = produkRows[0].total || 0;

    // 2. Total Produksi Bulan Ini
    const [produksiRows] = await db.query('SELECT IFNULL(SUM(jumlah_ton), 0) as total FROM produksi WHERE MONTH(tanggal_produksi) = MONTH(CURRENT_DATE()) AND YEAR(tanggal_produksi) = YEAR(CURRENT_DATE())');
    const produksi_bulan_ini = produksiRows[0].total || 0;

    // 3. Order Transaksi Pending (Diproses)
    const [pendingRows] = await db.query("SELECT COUNT(*) as total FROM transaksi WHERE status = 'Diproses'");
    const order_pending = pendingRows[0].total || 0;

    // 4. Total Stok Gudang
    let stok_gudang = 0;
    try {
      const [stokRows] = await db.query('SELECT IFNULL(SUM(jumlah_stok_ton), 0) as total FROM stok_gudang');
      stok_gudang = stokRows[0].total || 0;
    } catch(err) {
      // Abaikan jika tabel stok_gudang belum ada
      stok_gudang = 0;
    }
    
    // Kirimkan response JSON ke frontend
    res.json({
      total_produk,
      produksi_bulan_ini,
      order_pending,
      stok_gudang
    });
  } catch (error) {
    console.error('Error Query Database:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data dari database' });
  }
});

module.exports = router;
