// models/partModel.js
const db = require('../config/db');


// Get all parts from the database
const getAllParts = async () => {
  const [rows] = await db.query('SELECT * FROM parts');
  return rows;
};

// Get parts by specific type (e.g., 'CPU', 'GPU', etc.)
const getPartsByType = async (type) => {
  const [rows] = await db.query('SELECT * FROM parts WHERE type = ?', [type]);
  return rows;
};

module.exports = {
  getAllParts,
  getPartsByType,
};
