const mysql = require('mysql2/promise');

// Konfigurasi koneksi database MySQL
// Sesuaikan user, password, dan database dengan yang ada di komputer Anda
const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Default user XAMPP/WAMP
  password: '', // Default password kosong (sesuaikan jika ada)
  database: 'scm_garam', // Pastikan Anda sudah membuat database ini di MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = dbPool;
