const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const likeController = require('../controllers/likeController');

// Like/unlike toggle
router.post('/', auth, likeController.toggleLike);

// Get which posts this user liked
router.get('/user-liked', auth, likeController.getUserLikedPosts);

// Total like count for post
router.get('/:postId', likeController.getLikeCount);



module.exports = router;
