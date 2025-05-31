const db = require('../config/db');

// Add compatibility pair
const addCompatibility = async (partId, compatibleWithId) => {
  await db.query(
    'INSERT INTO compatibility (part_id, compatible_with_id) VALUES (?, ?)',
    [partId, compatibleWithId]
  );
};

// Check if a compatibility entry exists
const isCompatible = async (partId1, partId2) => {
  const [rows] = await db.query(
    `SELECT * FROM compatibility 
     WHERE (part_id = ? AND compatible_with_id = ?) 
        OR (part_id = ? AND compatible_with_id = ?)`,
    [partId1, partId2, partId2, partId1]
  );
  return rows.length > 0;
};

module.exports = {
  addCompatibility,
  isCompatible
};
