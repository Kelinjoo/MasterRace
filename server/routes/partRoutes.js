const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkCompatibility, addCompatibilityPair } = require('../controllers/compatibilityController');

// GET /api/parts - get all parts (public)
router.get('/', partController.getAllParts);

// POST /api/parts/check-compatibility
router.post('/check-compatibility', checkCompatibility);

// POST /api/parts/add-compatibility - admin only
router.post('/add-compatibility', authMiddleware, (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Only administrators can add compatibility.' });
  }
  next();
}, addCompatibilityPair);

// GET /api/parts/:type - must go LAST to avoid catching /check-compatibility or /add-compatibility
router.get('/:type', partController.getPartsByType);

// POST /api/parts - add a new part (admin only)
router.post('/', authMiddleware, (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Only administrators can add parts.' });
  }
  next();
}, partController.addPart);

module.exports = router;
