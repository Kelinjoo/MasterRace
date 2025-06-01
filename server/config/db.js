// config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306, // Add this line
  user: process.env.DB_USER || 'codeigniter',
  password: process.env.DB_PASSWORD || 'codeigniter2019',
  database: process.env.DB_NAME || 'MRace',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

///// Test the database connection immediately
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error.message);
    process.exit(1); // stop app if DB is unreachable
  }
})();

module.exports = pool;

