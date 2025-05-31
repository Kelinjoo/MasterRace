const { isCompatible, addCompatibility } = require('../models/compatibilityModel');

const checkCompatibility = async (req, res) => {
  const { partIds } = req.body;

  if (!Array.isArray(partIds) || partIds.length < 2) {
    return res.status(400).json({ message: 'At least 2 parts required' });
  }

  const incompatiblePairs = [];

  for (let i = 0; i < partIds.length; i++) {
    for (let j = i + 1; j < partIds.length; j++) {
      const compatible = await isCompatible(partIds[i], partIds[j]);
      if (!compatible) {
        incompatiblePairs.push([partIds[i], partIds[j]]);
      }
    }
  }

  if (incompatiblePairs.length > 0) {
    return res.status(200).json({ compatible: false, incompatiblePairs });
  }

  res.status(200).json({ compatible: true });
};

const addCompatibilityPair = async (req, res) => {
    const { partId, compatibleWithId } = req.body;
  
    if (!partId || !compatibleWithId) {
      return res.status(400).json({ message: 'Both part IDs are required' });
    }
  
    try {
      await addCompatibility(partId, compatibleWithId);
      res.status(201).json({ message: 'Compatibility entry added successfully' });
    } catch (error) {
      console.error('Error adding compatibility:', error);
      res.status(500).json({ message: 'Server error while adding compatibility' });
    }
  };

module.exports = {
  checkCompatibility,
  addCompatibilityPair
};
