const db = require('../config/db');

// Add a like
const addLike = async (userId, postId) => {
    const [result] = await db.query(
        'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
        [userId, postId]
    );
    return result;
};

// Remove a like
const removeLike = async (userId, postId) => {
    const [result] = await db.query(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );
    return result;
};

// Check if like exists
const checkLikeExists = async (userId, postId) => {
    const [rows] = await db.query(
        'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );
    return rows.length > 0;
};

// Count likes
const countLikes = async (postId) => {
    const [rows] = await db.query(
        'SELECT COUNT(*) as total FROM likes WHERE post_id = ?',
        [postId]
    );
    return rows[0].total;
};

module.exports = {
    addLike,
    removeLike,
    checkLikeExists,
    countLikes
};
