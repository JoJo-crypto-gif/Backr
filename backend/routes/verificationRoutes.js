// routes/verificationRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const { adminAuth } = require('../middleware/adminAuth');

// Configure multer specifically for Ghana Card image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make sure this directory exists: uploads/ghana-cards
    cb(null, 'uploads/ghana-cards');
  },
  filename: function (req, file, cb) {
    // Use the user's ID and a timestamp to create a unique filename
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
}

// Route for a user to apply for verification
router.post('/apply', ensureAuthenticated, upload.single('ghanaCardImage'), async (req, res) => {
  try {
    const { ghanaCardNumber, verificationReason } = req.body;
    const ghanaCardImage = req.file ? req.file.filename : null;

    // Check if the Ghana card number is already in use by another user
    const existingUser = await User.findOne({ ghanaCardNumber: ghanaCardNumber });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res.status(409).json({ message: 'This Ghana Card number is already in use by another account.' });
    }

    // Update the user's verification fields in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ghanaCardNumber,
        ghanaCardImage,
        verificationReason,
        verificationStatus: 'pending',
        isVerified: false
      },
      { new: true } // Return the updated user document
    );

    res.status(200).json({
      message: 'Verification application submitted successfully. Please wait for an admin to review it.',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error submitting verification application:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }

  // Route to get all pending verification applications
router.get('/verification-applications', adminAuth, async (req, res) => {
  try {
    const pendingUsers = await User.find({ verificationStatus: 'pending' });
    res.json(pendingUsers);
  } catch (err) {
    console.error('Fetch pending verification applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Route to approve a verification application
router.put('/approve-verification/:userId', adminAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        verificationStatus: 'approved',
        isVerified: true
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User verification approved', user });
  } catch (err) {
    console.error('Approve verification error:', err);
    res.status(500).json({ error: 'Failed to approve verification' });
  }
});

// Route to deny a verification application
router.put('/deny-verification/:userId', adminAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the uploaded image file to save storage space
    if (user.ghanaCardImage) {
      const imagePath = path.join(__dirname, '..', 'uploads', 'ghana-cards', user.ghanaCardImage);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image:', err);
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        verificationStatus: 'denied',
        isVerified: false,
        ghanaCardNumber: undefined,
        ghanaCardImage: undefined,
        verificationReason: undefined
      },
      { new: true }
    );
    res.json({ message: 'User verification denied', user: updatedUser });
  } catch (err) {
    console.error('Deny verification error:', err);
    res.status(500).json({ error: 'Failed to deny verification' });
  }
});
});

module.exports = router;