const db = require('../config/db');

// Add a like (only if it doesn't exist — enforced by primary key in DB)
const addLike = (userId, postId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
        db.query(sql, [userId, postId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Remove a like (unlike)
const removeLike = (userId, postId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
        db.query(sql, [userId, postId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Check if user already liked the post
const checkLikeExists = (userId, postId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';
        db.query(sql, [userId, postId], (err, results) => {
            if (err) reject(err);
            else resolve(results.length > 0);
        });
    });
};

// Count total likes for a post
const countLikes = (postId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) as total FROM likes WHERE post_id = ?';
        db.query(sql, [postId], (err, results) => {
            if (err) reject(err);
            else resolve(results[0].total);
        });
    });
};

console.log('Exporting countLikes:', typeof countLikes);


module.exports = {
    addLike,
    removeLike,
    checkLikeExists,
    countLikes
};
