// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatar');  // Store images in the 'uploads/avatar' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Get the file extension
    cb(null, `user-${Date.now()}${ext}`);  // Save file with a unique name
  }
});

const upload = multer({ storage });

// Update user by ID (name, bio, address, avatar)
router.put('/update/:id', upload.single('avatar'), async (req, res) => {
  try {
    const { name, bio, address } = req.body;  // Extract name, bio, and address
    const updateData = { name, bio, address };  // Prepare the update data object

    // Check if an avatar file was uploaded
    if (req.file) {
      // If the user already has an avatar, delete the old one
      if (req.body.oldAvatar && req.body.oldAvatar !== '/uploads/avatar/default.jpg') {
        const oldAvatarPath = path.join(__dirname, '..', req.body.oldAvatar);
        fs.unlink(oldAvatarPath, (err) => {
          if (err) {
            console.log('Error deleting old avatar:', err);
          } else {
            console.log('Old avatar deleted successfully');
          }
        });
      }

      // Save the new avatar path
      updateData.avatar = `/uploads/avatar/${req.file.filename}`;
    }

    // Update the user in the database using the user ID from the URL
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,  // User ID passed in the URL
      updateData,      // The fields to update
      { new: true }    // Return the updated user document
    );

    res.json(updatedUser);  // Send the updated user data back as response
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
