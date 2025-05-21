const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const likeController = require('../controllers/likeController');

// POST to like or unlike a post (toggle logic)
router.post('/', auth, likeController.toggleLike);

// GET total like count for a post
router.get('/:postId', likeController.getLikeCount);

module.exports = router;
