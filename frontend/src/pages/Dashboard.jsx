import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { userService } from '../services';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await userService.getDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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
        <h1 className="text-3xl font-bold mb-8">
          Welcome back, {dashboardData?.user?.name}!
        </h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white"
          >
            <h3 className="text-lg mb-2">Gifts Sent</h3>
            <p className="text-4xl font-bold">{dashboardData?.stats?.sentGifts || 0}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-gradient-to-br from-secondary-500 to-secondary-700 text-white"
          >
            <h3 className="text-lg mb-2">Gifts Received</h3>
            <p className="text-4xl font-bold">{dashboardData?.stats?.receivedGifts || 0}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white"
          >
            <h3 className="text-lg mb-2">Love Impact Points</h3>
            <p className="text-4xl font-bold">{dashboardData?.stats?.loveImpactPoints || 0}</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/gifts" className="btn btn-primary text-center">
              Browse Gifts
            </Link>
            <Link to="/orders" className="btn btn-secondary text-center">
              View Orders
            </Link>
            <Link to="/profile" className="btn btn-outline text-center">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Membership Status */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Membership Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Current Plan</p>
              <p className="text-2xl font-bold capitalize">
                {dashboardData?.user?.membershipStatus || 'Free'}
              </p>
            </div>
            <button className="btn btn-primary">Upgrade</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
