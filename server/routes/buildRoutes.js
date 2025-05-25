const express = require('express');
const router = express.Router();
const buildController = require('../controllers/buildController');
const authMiddleware = require('../middleware/authMiddleware');

// Create new build
router.post('/', authMiddleware, buildController.createBuild);

// Get user's builds
router.get('/', authMiddleware, buildController.getUserBuilds);

// Get parts in a build
router.get('/:buildId/parts', authMiddleware, buildController.getPartsForBuild);

// Update a build
router.put('/:id', authMiddleware, buildController.updateBuild);

// Delete a build
router.delete('/:id', authMiddleware, buildController.deleteBuild);

module.exports = router;
