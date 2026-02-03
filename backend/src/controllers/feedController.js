const FeedPost = require('../models/FeedPost');

// @desc    Get public feed
// @route   GET /api/feed
// @access  Public
const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const feedPosts = await FeedPost.find({ 
      moderationStatus: 'approved',
      isModerated: true 
    })
      .populate('sender', 'name profileImage')
      .populate('giftPackage', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await FeedPost.countDocuments({ 
      moderationStatus: 'approved',
      isModerated: true 
    });

    res.json({
      feedPosts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like a feed post
// @route   POST /api/feed/:id/like
// @access  Private
const likeFeedPost = async (req, res) => {
  try {
    const feedPost = await FeedPost.findById(req.params.id);

    if (!feedPost) {
      return res.status(404).json({ message: 'Feed post not found' });
    }

    feedPost.likes += 1;
    await feedPost.save();

    res.json({ message: 'Post liked', likes: feedPost.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Comment on a feed post
// @route   POST /api/feed/:id/comment
// @access  Private
const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    const feedPost = await FeedPost.findById(req.params.id);

    if (!feedPost) {
      return res.status(404).json({ message: 'Feed post not found' });
    }

    feedPost.comments.push({
      user: req.user.id,
      text,
    });
    await feedPost.save();

    res.json({ message: 'Comment added', feedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFeed,
  likeFeedPost,
  commentOnPost,
};
