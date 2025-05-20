const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

// Public: fetch all or single post
router.get('/', postController.getAll);
router.get('/:id', postController.getOne);

// Protected: create, update, delete
router.post('/', auth, postController.create);
router.put('/:id', auth, postController.update);
router.delete('/:id', auth, postController.remove);

module.exports = router;
