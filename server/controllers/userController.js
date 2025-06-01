const bcrypt = require('bcrypt');

const {
  getUserById,
  updateUsername,
  updateBio,
  updateProfilePic,
  updatePassword
} = require('../models/userModel');

// Get user info for the currently authenticated user
const getUserInfo = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the authenticated user's username
const changeUsername = async (req, res) => {
  const { newUsername } = req.body;
  try {
    await updateUsername(req.user.id, newUsername);
    res.json({ message: 'Username updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the user's bio
const changeBio = async (req, res) => {
  const { newBio } = req.body;
  try {
    await updateBio(req.user.id, newBio);
    res.json({ message: 'Bio updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the user's profile picture
const changeProfilePic = async (req, res) => {
  const { profilePicUrl } = req.body;
  try {
    await updateProfilePic(req.user.id, profilePicUrl);
    res.json({ message: 'Profile picture updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the user's password
const changePassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await updatePassword(req.user.id, hashed);
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getUserInfo,
  changeUsername,
  changeBio,
  changeProfilePic,
  changePassword
};
