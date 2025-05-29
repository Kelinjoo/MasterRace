const db = require('../config/db');

// Insert a new user
const createUser = async (username, email, hashedPassword) => {
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  const [result] = await db.query(sql, [username, email, hashedPassword]);
  return result;
};

// Retrieve user by username
const getUserByUsername = async (username) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await db.query(sql, [username]);
  return rows[0];
};

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT id, username, email, bio, profile_picture, is_admin FROM users WHERE id = ?', [id]);
  return rows[0];
};

// Update username
const updateUsername = async (userId, newUsername) => {
  const [result] = await db.query('UPDATE users SET username = ? WHERE id = ?', [newUsername, userId]);
  return result;
};

//  Update bio
const updateBio = async (userId, newBio) => {
  const [result] = await db.query('UPDATE users SET bio = ? WHERE id = ?', [newBio, userId]);
  return result;
};

// Update profile picture
const updateProfilePic = async (userId, profilePicUrl) => {
  const [result] = await db.query('UPDATE users SET profile_picture = ? WHERE id = ?', [profilePicUrl, userId]);
  return result;
};


// Update password
const updatePassword = async (userId, hashedPassword) => {
  const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
  return result;
};



module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  updateUsername,
  updateBio,
  updateProfilePic,
  updatePassword
};
