const mongoose = require('mongoose');

const feedPostSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  recipient: {
    name: String,
  },
  giftPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GiftPackage',
  },
  message: String,
  reaction: {
    type: String,
    message: String,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  isModerated: {
    type: Boolean,
    default: false,
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FeedPost', feedPostSchema);
