const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} = require('../models/postModel');

// Create a new post (requires authentication)
const create = async (req, res) => {
    const { title, description, imageUrl } = req.body;
    const userId = req.user.id; 

    try {
        await createPost(userId, title, description, imageUrl);
        res.status(201).json({ message: 'Post created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Retrieve all posts (public)
const getAll = async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific post by ID (public)
const getOne = async (req, res) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a post (owner or admin only)
const update = async (req, res) => {
    const { title, description, imageUrl } = req.body;
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;

    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Allow update if user is the post owner or admin
        if (post.user_id !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }

        const result = await updatePost(req.params.id, post.user_id, title, description, imageUrl);
        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a post (owner or admin only)
const remove = async (req, res) => {
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;

    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Allow delete if user is the post owner or admin
        if (post.user_id !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        const result = await deletePost(req.params.id, post.user_id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, getAll, getOne, update, remove };
