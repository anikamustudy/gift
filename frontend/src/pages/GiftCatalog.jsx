import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { giftService } from '../services';
import GiftCard from '../components/GiftCard';

const GiftCatalog = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchGifts();
  }, [filters]);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const data = await giftService.getGifts(filters);
      setGifts(data.giftPackages);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8">Gift Catalog</h1>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search gifts..."
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Categories</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="celebration">Celebration</option>
                <option value="apology">Apology</option>
                <option value="thankyou">Thank You</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="$0"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="$1000"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Gift Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading gifts...</div>
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No gifts found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gifts.map((gift) => (
              <GiftCard key={gift._id} gift={gift} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GiftCatalog;
