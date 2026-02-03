const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getGiftPackages,
  getGiftPackage,
  createGiftPackage,
  updateGiftPackage,
  deleteGiftPackage,
  uploadGiftImages,
} = require('../controllers/giftController');
const { protect } = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

router.get('/', getGiftPackages);
router.get('/:id', getGiftPackage);
router.post('/', protect, createGiftPackage);
router.put('/:id', protect, updateGiftPackage);
router.delete('/:id', protect, deleteGiftPackage);
router.post('/:id/images', protect, upload.array('images', 5), uploadGiftImages);

module.exports = router;
