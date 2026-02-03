const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getDashboard,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile-image', protect, upload.single('image'), uploadProfileImage);
router.get('/dashboard', protect, getDashboard);

module.exports = router;
