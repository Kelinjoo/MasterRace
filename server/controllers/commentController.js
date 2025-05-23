const {
    createComment,
    getCommentsByPostId,
    getCommentById,
    updateComment,
    deleteComment
} = require('../models/commentModel');

// Create a new comment
const create = async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.id;


    if (!postId || !content) {
        return res.status(400).json({ error: 'Post ID and content are required.' });
    }

    try {
        await createComment(postId, userId, content);
        res.status(201).json({ message: 'Comment created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all comments for a post
const getForPost = async (req, res) => {
    try {
        const comments = await getCommentsByPostId(req.params.postId);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update own comment
const update = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.userId;
    const { content } = req.body;

    try {
        const comment = await getCommentById(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        // Check if this user is the owner
        if (comment.user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this comment' });
        }

        await updateComment(commentId, userId, content);
        res.json({ message: 'Comment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete comment (owner or admin only)
const remove = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;

    try {
        const comment = await getCommentById(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        // Allow delete if admin or comment owner
        if (comment.user_id !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }

        await deleteComment(commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    create,
    getForPost,
    update,
    remove
};
