import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🎁 Gift Platform
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/gifts" className="text-gray-700 hover:text-primary-600">
              Browse Gifts
            </Link>
            <Link to="/feed" className="text-gray-700 hover:text-primary-600">
              Community Feed
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-primary-600"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-outline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
