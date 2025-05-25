const db = require('../config/db');

// Insert a new post
const createPost = async (userId, title, description, imageUrl) => {
    const [result] = await db.query(
        'INSERT INTO posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?)',
        [userId, title, description, imageUrl]
    );
    return result;
};

// Get all posts
const getAllPosts = async () => {
    const [results] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    return results;
};

// Get post by ID
const getPostById = async (id) => {
    const [results] = await db.query(
        'SELECT * FROM posts WHERE id = ?',
        [id]
    );
    return results[0];
};

// Update a post
const updatePost = async (id, title, description, imageUrl) => {
    const [result] = await db.query(
        'UPDATE posts SET title = ?, description = ?, image_url = ? WHERE id = ?',
        [title, description, imageUrl, id]
    );
    return result;
};


// Delete a post
const deletePost = async (id) => {
    const [result] = await db.query(
        'DELETE FROM posts WHERE id = ?',
        [id]
    );
    return result;
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
