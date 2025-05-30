const {
    addLike,
    removeLike,
    checkLikeExists,
    countLikes
  } = require('../models/likeModel');
  
  const db = require('../config/db');
  
  // Toggle like/unlike for a post
  const toggleLike = async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.body;
  
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }
  
    try {
      const alreadyLiked = await checkLikeExists(userId, postId);
  
      if (alreadyLiked) {
        await removeLike(userId, postId);
        return res.json({ message: 'Post unliked' });
      } else {
        await addLike(userId, postId);
        return res.json({ message: 'Post liked' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Get total like count for a post
  const getLikeCount = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const total = await countLikes(postId);
      res.json({ postId, totalLikes: total });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Get all post IDs this user has liked
  const getUserLikedPosts = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const [rows] = await db.query(
        'SELECT post_id FROM likes WHERE user_id = ?',
        [userId]
      );
      const likedPostIds = rows.map(r => r.post_id);
      res.json(likedPostIds);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch liked posts' });
    }
  };
  
  module.exports = {
    toggleLike,
    getLikeCount,
    getUserLikedPosts
  };
  