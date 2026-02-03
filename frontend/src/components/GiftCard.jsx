import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GiftCard = ({ gift }) => {
  const imageUrl = gift.images?.[0]?.url || 'https://via.placeholder.com/300';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card overflow-hidden cursor-pointer"
    >
      <Link to={`/gifts/${gift._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={gift.name}
            className="w-full h-full object-cover"
          />
          {!gift.availability && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {gift.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {gift.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              ${gift.basePrice}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {gift.category}
            </span>
          </div>

          {gift.tags && gift.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {gift.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default GiftCard;
