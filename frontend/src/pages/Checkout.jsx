import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { orderService } from '../services';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = ({ gift, selectedOptions, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    street: '',
    city: '',
    zipCode: '',
    giftType: 'public',
    message: '',
    scheduledDeliveryDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create order
      const customizations = Object.entries(selectedOptions).map(([itemName, option]) => ({
        itemName,
        selectedOption: option.name,
        priceAdjustment: option.priceAdjustment,
      }));

      const orderData = {
        recipient: {
          name: formData.recipientName,
          email: formData.recipientEmail,
          phone: formData.recipientPhone,
          address: {
            street: formData.street,
            city: formData.city,
            zipCode: formData.zipCode,
            country: 'Nepal',
          },
        },
        giftPackageId: gift._id,
        customizations,
        giftType: formData.giftType,
        message: formData.message,
        scheduledDeliveryDate: formData.scheduledDeliveryDate,
      };

      const orderResponse = await orderService.createOrder(orderData);
      const orderId = orderResponse.order._id;

      // Create payment intent
      const paymentResponse = await orderService.createPaymentIntent(orderId);

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentResponse.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Confirm payment on backend
      await orderService.confirmPayment(orderId);

      // Redirect to success page
      navigate('/orders', { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Recipient Information */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Recipient Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="recipientPhone"
              value={formData.recipientPhone}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Street Address</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gift Options */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Gift Options</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Gift Type</label>
            <select
              name="giftType"
              value={formData.giftType}
              onChange={handleChange}
              className="input"
            >
              <option value="public">Public (Show your name)</option>
              <option value="anonymous">Anonymous</option>
              <option value="reveal-later">Reveal Later</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Personal Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="input"
              rows="4"
              maxLength="500"
              placeholder="Write a personal message..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scheduled Delivery Date</label>
            <input
              type="date"
              name="scheduledDeliveryDate"
              value={formData.scheduledDeliveryDate}
              onChange={handleChange}
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
        <div className="p-4 border rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="card bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Gift Package:</span>
            <span className="font-semibold">{gift.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Base Price:</span>
            <span>${gift.basePrice}</span>
          </div>
          {Object.entries(selectedOptions).map(([itemName, option]) => (
            <div key={itemName} className="flex justify-between text-sm">
              <span>{itemName} ({option.name}):</span>
              <span>+${option.priceAdjustment}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-green-600">
            <span>Love Impact Contribution (2%):</span>
            <span>${(totalPrice * 0.02).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-primary-600">${totalPrice}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn btn-primary"
      >
        {loading ? 'Processing...' : `Pay $${totalPrice}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { giftId } = useParams();
  const location = useLocation();
  const { gift, selectedOptions, totalPrice } = location.state || {};

  if (!gift) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-xl">No gift selected for checkout</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            gift={gift}
            selectedOptions={selectedOptions}
            totalPrice={totalPrice}
          />
        </Elements>
      </motion.div>
    </div>
  );
};

export default Checkout;
