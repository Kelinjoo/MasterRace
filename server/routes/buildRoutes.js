// routes/buildRoutes.js
const express = require('express');
const router = express.Router();
const buildController = require('../controllers/buildController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/builds - create new build (protected)
router.post('/', authMiddleware, buildController.createBuild);

// GET /api/builds - get builds by current user (protected)
router.get('/', authMiddleware, buildController.getUserBuilds);

// GET /api/builds/:buildId/parts - get all parts in a build (protected)
router.get('/:buildId/parts', authMiddleware, buildController.getPartsForBuild);

module.exports = router;
