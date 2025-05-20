const db = require('../config/db');

const createPost = (userId, title, description, imageUrl) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?)';
        db.query(sql, [userId, title, description, imageUrl], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const getAllPosts = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC';
        db.query(sql, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

const getPostById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM posts WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
};

const updatePost = (id, userId, title, description, imageUrl) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE posts SET title = ?, description = ?, image_url = ? WHERE id = ? AND user_id = ?';
        db.query(sql, [title, description, imageUrl, id, userId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const deletePost = (id, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM posts WHERE id = ? AND user_id = ?';
        db.query(sql, [id, userId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
