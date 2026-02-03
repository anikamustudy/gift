const GiftPackage = require('../models/GiftPackage');
const cloudinary = require('../config/cloudinary');

// @desc    Get all gift packages
// @route   GET /api/gifts
// @access  Public
const getGiftPackages = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    
    let query = { availability: true };

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const giftPackages = await GiftPackage.find(query).sort({ createdAt: -1 });

    res.json({ giftPackages, count: giftPackages.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single gift package
// @route   GET /api/gifts/:id
// @access  Public
const getGiftPackage = async (req, res) => {
  try {
    const giftPackage = await GiftPackage.findById(req.params.id);

    if (!giftPackage) {
      return res.status(404).json({ message: 'Gift package not found' });
    }

    res.json({ giftPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create gift package (Admin only)
// @route   POST /api/gifts
// @access  Private
const createGiftPackage = async (req, res) => {
  try {
    const { name, description, category, basePrice, items, tags, deliveryZones, stock } = req.body;

    const giftPackage = await GiftPackage.create({
      name,
      description,
      category,
      basePrice,
      items,
      tags,
      deliveryZones: deliveryZones || ['kathmandu-valley'],
      stock,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: 'Gift package created', giftPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update gift package (Admin only)
// @route   PUT /api/gifts/:id
// @access  Private
const updateGiftPackage = async (req, res) => {
  try {
    const giftPackage = await GiftPackage.findById(req.params.id);

    if (!giftPackage) {
      return res.status(404).json({ message: 'Gift package not found' });
    }

    const updated = await GiftPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Gift package updated', giftPackage: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete gift package (Admin only)
// @route   DELETE /api/gifts/:id
// @access  Private
const deleteGiftPackage = async (req, res) => {
  try {
    const giftPackage = await GiftPackage.findById(req.params.id);

    if (!giftPackage) {
      return res.status(404).json({ message: 'Gift package not found' });
    }

    await GiftPackage.findByIdAndDelete(req.params.id);

    res.json({ message: 'Gift package deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload gift images
// @route   POST /api/gifts/:id/images
// @access  Private
const uploadGiftImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const giftPackage = await GiftPackage.findById(req.params.id);
    if (!giftPackage) {
      return res.status(404).json({ message: 'Gift package not found' });
    }

    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'gift-platform/gifts',
      })
    );

    const results = await Promise.all(uploadPromises);

    const images = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    giftPackage.images.push(...images);
    await giftPackage.save();

    res.json({ message: 'Images uploaded', images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading images' });
  }
};

module.exports = {
  getGiftPackages,
  getGiftPackage,
  createGiftPackage,
  updateGiftPackage,
  deleteGiftPackage,
  uploadGiftImages,
};
