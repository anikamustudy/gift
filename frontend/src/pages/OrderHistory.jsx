import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { orderService } from '../services';
import { useLocation } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      'out-for-delivery': 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8">Order History</h1>

        {location.state?.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Payment successful! Your gift is being processed.
          </div>
        )}

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No orders yet</p>
            <a href="/gifts" className="btn btn-primary">
              Browse Gifts
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                whileHover={{ scale: 1.02 }}
                className="card"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Gift Image */}
                  <div className="w-full md:w-32 h-32">
                    <img
                      src={order.giftPackage?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                      alt={order.giftPackage?.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {order.giftPackage?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Order #{order.orderNumber}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.deliveryStatus)}`}>
                        {order.deliveryStatus}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Recipient</p>
                        <p className="font-medium">{order.recipient.name}</p>
                        <p className="text-sm">{order.recipient.phone}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="text-sm">
                          {order.recipient.address.street}, {order.recipient.address.city}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">Total: </span>
                        <span className="text-lg font-bold text-primary-600">
                          ${order.totalAmount}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span>Gift Type: </span>
                        <span className="font-medium capitalize">{order.giftType}</span>
                      </div>

                      <div className="text-sm text-gray-600">
                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {order.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Message:</p>
                        <p className="text-sm italic">{order.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderHistory;
