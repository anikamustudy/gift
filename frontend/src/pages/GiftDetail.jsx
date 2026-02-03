import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { giftService } from '../services';

const GiftDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchGift();
  }, [id]);

  useEffect(() => {
    if (gift) {
      calculateTotalPrice();
    }
  }, [gift, selectedOptions]);

  const fetchGift = async () => {
    try {
      const data = await giftService.getGift(id);
      setGift(data.giftPackage);
      setTotalPrice(data.giftPackage.basePrice);
    } catch (error) {
      console.error('Error fetching gift:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    let price = gift.basePrice;
    Object.values(selectedOptions).forEach((option) => {
      price += option.priceAdjustment || 0;
    });
    setTotalPrice(price);
  };

  const handleOptionChange = (itemName, optionName, priceAdjustment) => {
    setSelectedOptions({
      ...selectedOptions,
      [itemName]: { name: optionName, priceAdjustment },
    });
  };

  const handleOrderNow = () => {
    navigate(`/checkout/${id}`, {
      state: { gift, selectedOptions, totalPrice },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-xl">Gift not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* Image Gallery */}
        <div>
          <div className="card">
            <img
              src={gift.images?.[0]?.url || 'https://via.placeholder.com/500'}
              alt={gift.name}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            <div className="grid grid-cols-4 gap-2">
              {gift.images?.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${gift.name} ${index + 2}`}
                  className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gift Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{gift.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{gift.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-primary-600">
              ${totalPrice}
            </span>
            {totalPrice !== gift.basePrice && (
              <span className="ml-2 text-gray-500 line-through">
                ${gift.basePrice}
              </span>
            )}
          </div>

          {/* Customization Options */}
          {gift.items && gift.items.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Customize Your Gift</h2>
              {gift.items
                .filter((item) => item.isCustomizable)
                .map((item, index) => (
                  <div key={index} className="mb-4">
                    <label className="block font-medium mb-2">{item.name}</label>
                    <select
                      className="input"
                      onChange={(e) => {
                        const option = item.options.find(
                          (opt) => opt.name === e.target.value
                        );
                        handleOptionChange(
                          item.name,
                          e.target.value,
                          option?.priceAdjustment || 0
                        );
                      }}
                    >
                      <option value="">Select option</option>
                      {item.options?.map((option, optIdx) => (
                        <option key={optIdx} value={option.name}>
                          {option.name}{' '}
                          {option.priceAdjustment > 0 &&
                            `(+$${option.priceAdjustment})`}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          )}

          {/* Package Items */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">What's Included</h2>
            <ul className="space-y-2">
              {gift.items?.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Button */}
          <button
            onClick={handleOrderNow}
            disabled={!gift.availability}
            className="w-full btn btn-primary"
          >
            {gift.availability ? 'Order Now' : 'Out of Stock'}
          </button>

          {/* Delivery Info */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Delivery Information</h3>
            <p className="text-sm text-gray-600">
              • Available in: {gift.deliveryZones?.join(', ')}
            </p>
            <p className="text-sm text-gray-600">
              • Estimated delivery: 2-3 business days
            </p>
            <p className="text-sm text-gray-600">
              • Love Impact: 2% of your purchase goes to community programs
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GiftDetail;
