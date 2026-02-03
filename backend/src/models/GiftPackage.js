const mongoose = require('mongoose');

const giftPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
  },
  category: {
    type: String,
    enum: ['birthday', 'anniversary', 'celebration', 'apology', 'thankyou', 'custom'],
    default: 'custom',
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0,
  },
  images: [{
    url: String,
    publicId: String,
  }],
  items: [{
    name: String,
    description: String,
    isCustomizable: { type: Boolean, default: false },
    options: [{ 
      name: String, 
      priceAdjustment: { type: Number, default: 0 } 
    }],
  }],
  availability: {
    type: Boolean,
    default: true,
  },
  deliveryZones: [{
    type: String,
    default: 'kathmandu-valley',
  }],
  stock: {
    type: Number,
    default: 100,
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// Update the updatedAt field before saving
giftPackageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('GiftPackage', giftPackageSchema);
