const mongoose = require('mongoose');
const dotenv = require('dotenv');
const GiftPackage = require('./src/models/GiftPackage');
const connectDB = require('./src/config/database');

dotenv.config();

// Connect to database
connectDB();

const giftPackages = [
  {
    name: 'Birthday Celebration Package',
    description: 'Perfect for birthday celebrations with a delightful mix of treats and decorations',
    category: 'birthday',
    basePrice: 49.99,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500',
        publicId: 'sample-1',
      },
    ],
    items: [
      {
        name: 'Birthday Cake',
        description: 'Delicious chocolate cake (1 kg)',
        isCustomizable: true,
        options: [
          { name: 'Chocolate', priceAdjustment: 0 },
          { name: 'Vanilla', priceAdjustment: 0 },
          { name: 'Red Velvet', priceAdjustment: 5 },
        ],
      },
      {
        name: 'Balloons',
        description: 'Set of 20 colorful balloons',
        isCustomizable: false,
      },
      {
        name: 'Birthday Card',
        description: 'Personalized birthday card',
        isCustomizable: false,
      },
      {
        name: 'Party Hat',
        description: 'Fun party hat set',
        isCustomizable: false,
      },
    ],
    availability: true,
    deliveryZones: ['kathmandu-valley'],
    stock: 50,
    tags: ['birthday', 'celebration', 'party', 'cake'],
  },
  {
    name: 'Anniversary Romance Package',
    description: 'Express your love with this romantic anniversary gift package',
    category: 'anniversary',
    basePrice: 89.99,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518430236863-5b4a8e9b7c4e?w=500',
        publicId: 'sample-2',
      },
    ],
    items: [
      {
        name: 'Red Roses Bouquet',
        description: 'Beautiful bouquet of fresh red roses',
        isCustomizable: true,
        options: [
          { name: '12 Roses', priceAdjustment: 0 },
          { name: '24 Roses', priceAdjustment: 20 },
          { name: '36 Roses', priceAdjustment: 40 },
        ],
      },
      {
        name: 'Chocolate Box',
        description: 'Premium chocolate assortment',
        isCustomizable: false,
      },
      {
        name: 'Champagne',
        description: 'Bottle of sparkling champagne',
        isCustomizable: false,
      },
      {
        name: 'Greeting Card',
        description: 'Romantic anniversary card',
        isCustomizable: false,
      },
    ],
    availability: true,
    deliveryZones: ['kathmandu-valley'],
    stock: 30,
    tags: ['anniversary', 'romance', 'love', 'flowers'],
  },
  {
    name: 'Thank You Appreciation Package',
    description: 'Show your gratitude with this thoughtful thank you package',
    category: 'thankyou',
    basePrice: 34.99,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500',
        publicId: 'sample-3',
      },
    ],
    items: [
      {
        name: 'Flower Arrangement',
        description: 'Mixed flower arrangement',
        isCustomizable: true,
        options: [
          { name: 'Small', priceAdjustment: 0 },
          { name: 'Medium', priceAdjustment: 10 },
          { name: 'Large', priceAdjustment: 20 },
        ],
      },
      {
        name: 'Gourmet Cookies',
        description: 'Box of handmade gourmet cookies',
        isCustomizable: false,
      },
      {
        name: 'Thank You Card',
        description: 'Heartfelt thank you card',
        isCustomizable: false,
      },
      {
        name: 'Gift Wrap',
        description: 'Beautiful gift wrapping',
        isCustomizable: false,
      },
    ],
    availability: true,
    deliveryZones: ['kathmandu-valley'],
    stock: 100,
    tags: ['thankyou', 'gratitude', 'appreciation', 'flowers'],
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await GiftPackage.deleteMany({});
    console.log('Cleared existing gift packages');

    // Insert seed data
    await GiftPackage.insertMany(giftPackages);
    console.log('Seed data inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
