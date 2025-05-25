const buildModel = require('../models/buildModel');

// Create a new build
const createBuild = async (req, res) => {
  const userId = req.user.id;
  const { name, partIds } = req.body;

  if (!name || !Array.isArray(partIds) || partIds.length === 0) {
    return res.status(400).json({ message: 'Name and parts are required' });
  }

  try {
    const buildId = await buildModel.createBuild(userId, name);
    for (const partId of partIds) {
      await buildModel.addPartToBuild(buildId, partId);
    }
    res.status(201).json({ message: 'Build created', buildId });
  } catch (error) {
    console.error('Error creating build:', error);
    res.status(500).json({ message: 'Server error while creating build' });
  }
};

// Get all builds for the user
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

// Update build
const updateBuild = async (req, res) => {
  const userId = req.user.id;
  const buildId = req.params.id;
  const { name, partIds } = req.body;

  if (!name || !Array.isArray(partIds) || partIds.length === 0) {
    return res.status(400).json({ message: 'Name and parts are required' });
  }

  try {
    const userBuilds = await buildModel.getBuildsByUser(userId);
    const build = userBuilds.find(b => b.id == buildId);
    if (!build) return res.status(403).json({ message: 'Not your build' });

    await buildModel.updateBuild(buildId, userId, name);
    await buildModel.clearPartsFromBuild(buildId);
    for (const partId of partIds) {
      await buildModel.addPartToBuild(buildId, partId);
    }

    res.json({ message: 'Build updated successfully' });
  } catch (error) {
    console.error('Error updating build:', error);
    res.status(500).json({ message: 'Server error while updating build' });
  }
};

// Delete build
const deleteBuild = async (req, res) => {
  const userId = req.user.id;
  const buildId = req.params.id;

  try {
    const userBuilds = await buildModel.getBuildsByUser(userId);
    const build = userBuilds.find(b => b.id == buildId);
    if (!build) return res.status(403).json({ message: 'Not your build' });

    await buildModel.clearPartsFromBuild(buildId);
    await buildModel.deleteBuild(buildId, userId);

    res.json({ message: 'Build deleted successfully' });
  } catch (error) {
    console.error('Error deleting build:', error);
    res.status(500).json({ message: 'Server error while deleting build' });
  }
};

module.exports = {
  createBuild,
  getUserBuilds,
  getPartsForBuild,
  updateBuild,
  deleteBuild
};
