const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const commentController = require('../controllers/commentController');

// GET all comments for a specific post (public)
router.get('/:postId', commentController.getForPost);

// POST a new comment (authenticated)
router.post('/', auth, commentController.create);

// PUT to update your own comment (authenticated)
router.put('/:id', auth, commentController.update);

// DELETE to remove your own comment or if admin (authenticated)
router.delete('/:id', auth, commentController.remove);

module.exports = router;
