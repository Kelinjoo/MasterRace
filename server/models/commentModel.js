const db = require('../config/db');

// Create a new comment
const createComment = (postId, userId, content) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
        db.query(sql, [postId, userId, content], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Get all comments for a specific post
const getCommentsByPostId = (postId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT comments.*, users.username 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE post_id = ? 
            ORDER BY created_at ASC
        `;
        db.query(sql, [postId], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

// Check if comment exists and who owns it
const getCommentById = (commentId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM comments WHERE id = ?';
        db.query(sql, [commentId], (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
};

// Update a comment
const updateComment = (commentId, userId, newContent) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?';
        db.query(sql, [newContent, commentId, userId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Delete a comment (restricted by controller logic to owner or admin)
const deleteComment = (commentId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM comments WHERE id = ?';
        db.query(sql, [commentId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = {
    createComment,
    getCommentsByPostId,
    getCommentById,
    updateComment,
    deleteComment
};
