import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Send Love Across Borders
          </motion.h1>
          <motion.p
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="text-xl md:text-2xl mb-8"
          >
            A membership-based gifting platform connecting hearts worldwide to Nepal
          </motion.p>
          <div className="flex justify-center gap-4">
            <Link to="/gifts" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Browse Gifts
            </Link>
            <Link to="/register" className="btn bg-secondary-600 text-white hover:bg-secondary-700">
              Join Now
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6"
            >
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">Curated Packages</h3>
              <p className="text-gray-600">
                Handpicked gift packages for every occasion
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6"
            >
              <div className="text-5xl mb-4">🤫</div>
              <h3 className="text-xl font-semibold mb-2">Anonymous Gifting</h3>
              <p className="text-gray-600">
                Send gifts anonymously or reveal later for surprise moments
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6"
            >
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Love Impact Rewards</h3>
              <p className="text-gray-600">
                Earn points and contribute to community programs
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Sign Up', desc: 'Create your free account' },
              { step: 2, title: 'Choose Gift', desc: 'Browse our curated packages' },
              { step: 3, title: 'Customize', desc: 'Personalize your gift' },
              { step: 4, title: 'Send Love', desc: 'Complete payment and deliver' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Send Your First Gift?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of members spreading love worldwide
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
