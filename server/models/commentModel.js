const db = require('../config/db');

// Create a new comment
const createComment = async (postId, userId, content) => {
    const [result] = await db.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [postId, userId, content]
    );
    return result;
};

// Get all comments for a specific post
const getCommentsByPostId = async (postId) => {
    const [results] = await db.query(`
        SELECT comments.*, users.username 
        FROM comments 
        JOIN users ON comments.user_id = users.id 
        WHERE post_id = ? 
        ORDER BY created_at ASC
    `, [postId]);
    return results;
};

// Get one comment
const getCommentById = async (commentId) => {
    const [results] = await db.query(
        'SELECT * FROM comments WHERE id = ?',
        [commentId]
    );
    return results[0];
};

// Update comment
const updateComment = async (commentId, newContent) => {
    const [result] = await db.query(
        'UPDATE comments SET content = ? WHERE id = ?',
        [newContent, commentId]
    );
    return result;
};


// Delete comment
const deleteComment = async (commentId) => {
    const [result] = await db.query(
        'DELETE FROM comments WHERE id = ?',
        [commentId]
    );
    return result;
};

module.exports = {
    createComment,
    getCommentsByPostId,
    getCommentById,
    updateComment,
    deleteComment
};
