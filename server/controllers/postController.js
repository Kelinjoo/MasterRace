const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} = require('../models/postModel');

const create = async (req, res) => {
    const { title, description, imageUrl } = req.body;
    const userId = req.user.userId;

    try {
        await createPost(userId, title, description, imageUrl);
        res.status(201).json({ message: 'Post created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAll = async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOne = async (req, res) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    const { title, description, imageUrl } = req.body;
    const userId = req.user.userId;

    try {
        const result = await updatePost(req.params.id, userId, title, description, imageUrl);
        if (result.affectedRows === 0) return res.status(403).json({ error: 'Not allowed' });
        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await deletePost(req.params.id, userId);
        if (result.affectedRows === 0) return res.status(403).json({ error: 'Not allowed' });
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, getAll, getOne, update, remove };
