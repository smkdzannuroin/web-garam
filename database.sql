-- ==========================================
-- Database Schema untuk SCM Garam
-- ==========================================

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS scm_garam;
USE scm_garam;

-- 1. Tabel Users (Untuk Login Admin/Staff)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'manager') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Produk (Master Data Produk)
CREATE TABLE IF NOT EXISTS produk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_produk VARCHAR(50) NOT NULL UNIQUE,
  nama_produk VARCHAR(100) NOT NULL,
  kategori ENUM('Garam Halus', 'Garam Kasar', 'Garam Industri', 'Garam Beryodium') NOT NULL,
  harga_per_kg DECIMAL(10,2) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Supplier (Tambak/Petani Garam)
CREATE TABLE IF NOT EXISTS supplier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_supplier VARCHAR(100) NOT NULL,
  kontak VARCHAR(50),
  alamat TEXT,
  status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Gudang (Lokasi Penyimpanan)
CREATE TABLE IF NOT EXISTS gudang (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_gudang VARCHAR(100) NOT NULL,
  lokasi TEXT NOT NULL,
  kapasitas_ton DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Stok Gudang (Menyimpan jumlah produk di masing-masing gudang)
CREATE TABLE IF NOT EXISTS stok_gudang (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_gudang INT NOT NULL,
  id_produk INT NOT NULL,
  jumlah_stok_ton DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_gudang) REFERENCES gudang(id) ON DELETE CASCADE,
  FOREIGN KEY (id_produk) REFERENCES produk(id) ON DELETE CASCADE
);

-- 6. Tabel Produksi (Pencatatan Garam Masuk dari Supplier ke Gudang)
CREATE TABLE IF NOT EXISTS produksi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_number VARCHAR(50) NOT NULL UNIQUE,
  id_produk INT NOT NULL,
  id_supplier INT NOT NULL,
  id_gudang INT NOT NULL,
  jumlah_ton DECIMAL(10,2) NOT NULL,
  tanggal_produksi DATE NOT NULL,
  status ENUM('Proses', 'Selesai', 'Dibatalkan') DEFAULT 'Proses',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_produk) REFERENCES produk(id),
  FOREIGN KEY (id_supplier) REFERENCES supplier(id),
  FOREIGN KEY (id_gudang) REFERENCES gudang(id)
);

-- 7. Tabel Transaksi (Penjualan / Order Pelanggan)
CREATE TABLE IF NOT EXISTS transaksi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  no_order VARCHAR(50) NOT NULL UNIQUE,
  nama_pembeli VARCHAR(100) NOT NULL,
  id_produk INT NOT NULL,
  jumlah_kg DECIMAL(10,2) NOT NULL,
  total_harga DECIMAL(15,2) NOT NULL,
  tanggal_transaksi DATE NOT NULL,
  status ENUM('Diproses', 'Dikirim', 'Selesai', 'Dibatalkan') DEFAULT 'Diproses',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_produk) REFERENCES produk(id)
);

-- 8. Tabel Distribusi (Logistik & Pengiriman)
CREATE TABLE IF NOT EXISTS distribusi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_transaksi INT,
  tujuan TEXT NOT NULL,
  armada VARCHAR(100) NOT NULL,
  nama_supir VARCHAR(100),
  muatan_ton DECIMAL(10,2) NOT NULL,
  tanggal_pengiriman DATE NOT NULL,
  status ENUM('Pending', 'Perjalanan', 'Terkirim') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_transaksi) REFERENCES transaksi(id) ON DELETE SET NULL
);

-- ==========================================
-- Insert Dummy Data (Data Percobaan)
-- ==========================================
INSERT INTO users (name, email, password, role) VALUES ('Admin SCM', 'admin@scm.com', 'password123', 'admin');

INSERT INTO produk (kode_produk, nama_produk, kategori, harga_per_kg) VALUES 
('PRD-001', 'Garam Halus Premium', 'Garam Halus', 5000),
('PRD-002', 'Garam Industri', 'Garam Industri', 3000);

INSERT INTO supplier (nama_supplier, alamat) VALUES 
('Tambak Madura', 'Jl. Garam No 1, Madura'),
('Tambak Pati', 'Kawasan Pesisir Pati');

INSERT INTO gudang (nama_gudang, lokasi, kapasitas_ton) VALUES 
('Gudang Utama Surabaya', 'Surabaya Utara', 5000),
('Gudang Transit Semarang', 'Pelabuhan Tanjung Emas', 2000);

INSERT INTO stok_gudang (id_gudang, id_produk, jumlah_stok_ton) VALUES 
(1, 1, 3200),
(2, 2, 1950);
