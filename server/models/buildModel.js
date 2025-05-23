// models/buildModel.js
const db = require('../config/db'); 


// Create a new build and return the new build's ID
const createBuild = async (userId, name) => {
  const [result] = await db.query(
    'INSERT INTO builds (user_id, name) VALUES (?, ?)',
    [userId, name]
  );
  return result.insertId;
};

// Link a part to a build
const addPartToBuild = async (buildId, partId) => {
  await db.query(
    'INSERT INTO build_parts (build_id, part_id) VALUES (?, ?)',
    [buildId, partId]
  );
};

// Get all builds by a specific user
const getBuildsByUser = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM builds WHERE user_id = ?',
    [userId]
  );
  return rows;
};

// Get all parts for a specific build
const getPartsForBuild = async (buildId) => {
  const [rows] = await db.query(
    `SELECT p.* FROM parts p
     JOIN build_parts bp ON p.id = bp.part_id
     WHERE bp.build_id = ?`,
    [buildId]
  );
  return rows;
};

module.exports = {
  createBuild,
  addPartToBuild,
  getBuildsByUser,
  getPartsForBuild,
};
