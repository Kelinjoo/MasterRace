const db = require('../config/db');

// Insert a new user using async/await
const createUser = async (username, email, hashedPassword) => {
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  const [result] = await db.query(sql, [username, email, hashedPassword]);
  return result;
};

// Retrieve a user by username
const getUserByUsername = async (username) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await db.query(sql, [username]);
  return rows[0]; // assuming username is unique
};

module.exports = { createUser, getUserByUsername };

