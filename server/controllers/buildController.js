// controllers/buildController.js
const buildModel = require('../models/buildModel');

// Create a new build and link selected parts
const createBuild = async (req, res) => {
  const userId = req.user.id; // From JWT middleware
  const { name, partIds } = req.body;

  if (!name || !Array.isArray(partIds) || partIds.length === 0) {
    return res.status(400).json({ message: 'Name and parts are required' });
  }

  try {
    const buildId = await buildModel.createBuild(userId, name);

    for (const partId of partIds) {
      await buildModel.addPartToBuild(buildId, partId); // inserts into buildpart
    }

    res.status(201).json({ message: 'Build created', buildId });
  } catch (error) {
    console.error('Error creating build:', error);
    res.status(500).json({ message: 'Server error while creating build' });
  }
};

// Get all builds for a user
const getUserBuilds = async (req, res) => {
  const userId = req.user.id;
  try {
    const builds = await buildModel.getBuildsByUser(userId);
    res.status(200).json(builds);
  } catch (error) {
    console.error('Error fetching builds:', error);
    res.status(500).json({ message: 'Server error while retrieving builds' });
  }
};

// Get all parts in a specific build
const getPartsForBuild = async (req, res) => {
  const { buildId } = req.params;
  try {
    const parts = await buildModel.getPartsForBuild(buildId);
    res.status(200).json(parts);
  } catch (error) {
    console.error('Error fetching parts for build:', error);
    res.status(500).json({ message: 'Server error while retrieving build parts' });
  }
};

module.exports = {
  createBuild,
  getUserBuilds,
  getPartsForBuild,
};
