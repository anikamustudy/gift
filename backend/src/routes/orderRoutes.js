const express = require('express');
const router = express.Router();
const {
  createOrder,
  createPaymentIntent,
  confirmPayment,
  getUserOrders,
  getOrder,
  addReaction,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.post('/:id/payment', protect, createPaymentIntent);
router.post('/:id/confirm-payment', protect, confirmPayment);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/reaction', addReaction);

module.exports = router;
