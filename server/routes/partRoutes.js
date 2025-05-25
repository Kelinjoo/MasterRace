// routes/partRoutes.js
const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/parts - get all parts (public)
router.get('/', partController.getAllParts);

// GET /api/parts/:type - get parts by type (e.g. /api/parts/CPU)
router.get('/:type', partController.getPartsByType);

// POST /api/parts - add a new part (admin only)
router.post('/', authMiddleware, (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Only administrators can add parts.' });
    }
    next();
}, partController.addPart);

module.exports = router;
