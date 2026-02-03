const express = require('express');
const router = express.Router();
const {
  getFeed,
  likeFeedPost,
  commentOnPost,
} = require('../controllers/feedController');
const { protect } = require('../middleware/auth');

router.get('/', getFeed);
router.post('/:id/like', protect, likeFeedPost);
router.post('/:id/comment', protect, commentOnPost);

module.exports = router;
