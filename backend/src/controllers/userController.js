const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, privacySettings } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (privacySettings) user.privacySettings = { ...user.privacySettings, ...privacySettings };

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload profile image
// @route   POST /api/users/profile-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'gift-platform/profiles',
      width: 300,
      height: 300,
      crop: 'fill',
    });

    const user = await User.findById(req.user.id);
    user.profileImage = result.secure_url;
    await user.save();

    res.json({ message: 'Profile image updated', imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const Order = require('../models/Order');

    const sentGifts = await Order.find({ sender: req.user.id }).countDocuments();
    const receivedGifts = await Order.find({ 'recipient.email': user.email }).countDocuments();

    res.json({
      user: {
        name: user.name,
        email: user.email,
        membershipStatus: user.membershipStatus,
        loveImpactPoints: user.loveImpactPoints,
        profileImage: user.profileImage,
      },
      stats: {
        sentGifts,
        receivedGifts,
        loveImpactPoints: user.loveImpactPoints,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getDashboard,
};
