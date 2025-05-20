const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

router.get('/', postController.getAll);
router.get('/:id', postController.getOne);
router.post('/', auth, postController.create);
router.put('/:id', auth, postController.update);
router.delete('/:id', auth, postController.remove);

module.exports = router;
