const db = require('../config/db');

// Create a new build
const createBuild = async (userId, name) => {
  const [result] = await db.query(
    'INSERT INTO builds (user_id, name) VALUES (?, ?)',
    [userId, name]
  );
  return result.insertId;
};

// Add part to build
const addPartToBuild = async (buildId, partId) => {
  await db.query(
    'INSERT INTO build_parts (build_id, part_id) VALUES (?, ?)',
    [buildId, partId]
  );
};

// Get builds by user
const getBuildsByUser = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM builds WHERE user_id = ?',
    [userId]
  );
  return rows;
};

// Get parts in a build
const getPartsForBuild = async (buildId) => {
  const [rows] = await db.query(
    `SELECT p.* FROM parts p
     JOIN build_parts bp ON p.id = bp.part_id
     WHERE bp.build_id = ?`,
    [buildId]
  );
  return rows;
};

// Update build name
const updateBuild = async (buildId, userId, name) => {
  const [result] = await db.query(
    'UPDATE builds SET name = ? WHERE id = ? AND user_id = ?',
    [name, buildId, userId]
  );
  return result;
};

// Clear all parts from build
const clearPartsFromBuild = async (buildId) => {
  const [result] = await db.query(
    'DELETE FROM build_parts WHERE build_id = ?',
    [buildId]
  );
  return result;
};

// Delete build
const deleteBuild = async (buildId, userId) => {
  const [result] = await db.query(
    'DELETE FROM builds WHERE id = ? AND user_id = ?',
    [buildId, userId]
  );
  return result;
};

module.exports = {
  createBuild,
  addPartToBuild,
  getBuildsByUser,
  getPartsForBuild,
  updateBuild,
  clearPartsFromBuild,
  deleteBuild
};

