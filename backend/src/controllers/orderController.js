const Order = require('../models/Order');
const GiftPackage = require('../models/GiftPackage');
const User = require('../models/User');
const FeedPost = require('../models/FeedPost');
const stripe = require('../config/stripe');

// @desc    Create an order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      recipient,
      giftPackageId,
      customizations,
      giftType,
      revealDate,
      message,
      scheduledDeliveryDate,
    } = req.body;

    // Get gift package
    const giftPackage = await GiftPackage.findById(giftPackageId);
    if (!giftPackage) {
      return res.status(404).json({ message: 'Gift package not found' });
    }

    // Check availability
    if (!giftPackage.availability || giftPackage.stock <= 0) {
      return res.status(400).json({ message: 'Gift package not available' });
    }

    // Calculate total amount
    let totalAmount = giftPackage.basePrice;
    if (customizations && customizations.length > 0) {
      customizations.forEach(custom => {
        totalAmount += custom.priceAdjustment || 0;
      });
    }

    // Check daily delivery limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyOrders = await Order.countDocuments({
      createdAt: { $gte: today },
      deliveryStatus: { $ne: 'cancelled' },
    });

    const maxDailyDeliveries = parseInt(process.env.MAX_DAILY_DELIVERIES) || 50;
    if (dailyOrders >= maxDailyDeliveries) {
      return res.status(400).json({ 
        message: 'Daily delivery limit reached. Please try again tomorrow.' 
      });
    }

    // Calculate Love Impact contribution (2% of total)
    const loveImpactContribution = Math.round(totalAmount * 0.02);

    // Create order
    const order = await Order.create({
      sender: req.user.id,
      recipient,
      giftPackage: giftPackageId,
      customizations,
      giftType,
      revealDate: giftType === 'reveal-later' ? revealDate : undefined,
      message,
      totalAmount,
      scheduledDeliveryDate,
      loveImpactContribution,
    });

    // Decrease stock
    giftPackage.stock -= 1;
    await giftPackage.save();

    res.status(201).json({ 
      message: 'Order created successfully', 
      order,
      clientSecret: null, // Will be set during payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create payment intent
// @route   POST /api/orders/:id/payment
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id,
      },
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// @desc    Confirm payment
// @route   POST /api/orders/:id/confirm-payment
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = 'completed';
      order.deliveryStatus = 'processing';

      // Award Love Impact points to sender
      const user = await User.findById(req.user.id);
      user.loveImpactPoints += order.loveImpactContribution;
      await user.save();

      await order.save();

      // Create feed post if not anonymous
      if (order.giftType !== 'anonymous') {
        await FeedPost.create({
          order: order._id,
          sender: order.sender,
          recipient: { name: order.recipient.name },
          giftPackage: order.giftPackage,
          message: order.message,
          isAnonymous: order.giftType === 'anonymous',
        });
      }

      res.json({ message: 'Payment confirmed', order });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ sender: req.user.id })
      .populate('giftPackage', 'name images basePrice')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('giftPackage')
      .populate('sender', 'name email profileImage');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.sender._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add reaction to received gift
// @route   POST /api/orders/:id/reaction
// @access  Public (with order verification)
const addReaction = async (req, res) => {
  try {
    const { type, message, verificationCode } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify the order belongs to the recipient (simple verification)
    // In production, implement proper verification

    order.reaction = {
      type,
      message,
      postedAt: new Date(),
    };
    await order.save();

    // Update feed post if exists
    const feedPost = await FeedPost.findOne({ order: order._id });
    if (feedPost) {
      feedPost.reaction = { type, message };
      await feedPost.save();
    }

    res.json({ message: 'Reaction added successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  createPaymentIntent,
  confirmPayment,
  getUserOrders,
  getOrder,
  addReaction,
};
