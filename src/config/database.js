const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Connection Pool
 * Menggunakan mysql2/promise untuk async/await support
 * 10 koneksi dalam pool untuk performance optimal
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistem_pengabdian',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

/**
 * Test koneksi saat server startup
 */
pool.getConnection()
  .then((connection) => {
    console.log('✅ MySQL berhasil terhubung!');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Gagal terhubung ke MySQL:', err.message);
    process.exit(1);
  });

module.exports = pool;
