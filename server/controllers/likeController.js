const {
    addLike,
    removeLike,
    checkLikeExists,
    countLikes
} = require('../models/likeModel');



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

// Count how many likes a post has
const getLikeCount = async (req, res) => {
    const { postId } = req.params;

    try {
        const total = await countLikes(postId);
        res.json({ postId, totalLikes: total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    toggleLike,
    getLikeCount
};
