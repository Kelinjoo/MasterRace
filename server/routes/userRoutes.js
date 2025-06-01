const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Import user controller functions
const {
  getUserInfo,
  changeUsername,
  changeBio,
  changeProfilePic,
  changePassword
} = require('../controllers/userController');

// Auth-protected routes for managing user account info
router.get('/me', auth, getUserInfo);
router.put('/username', auth, changeUsername);
router.put('/bio', auth, changeBio);
router.put('/profile-pic', auth, changeProfilePic);
router.put('/password', auth, changePassword);


module.exports = router;
