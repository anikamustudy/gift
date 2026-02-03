const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, default: 'Nepal' },
    },
  },
  giftPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GiftPackage',
    required: true,
  },
  customizations: [{
    itemName: String,
    selectedOption: String,
    priceAdjustment: Number,
  }],
  giftType: {
    type: String,
    enum: ['anonymous', 'reveal-later', 'public'],
    default: 'public',
  },
  revealDate: Date,
  message: {
    type: String,
    maxlength: 500,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentIntentId: String,
  deliveryStatus: {
    type: String,
    enum: ['pending', 'processing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryDate: Date,
  scheduledDeliveryDate: Date,
  reaction: {
    type: {
      type: String,
      enum: ['love', 'thanks', 'wow', 'happy'],
    },
    message: String,
    postedAt: Date,
  },
  loveImpactContribution: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `GFT${Date.now()}${count + 1}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
