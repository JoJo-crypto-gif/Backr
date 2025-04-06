const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs
const Campaign = require('../models/campaign');

const router = express.Router();

// Multer setup for image uploads (max 3 images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file names
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max per file
}).array('images', 3); // Accept up to 3 images

// Create a new campaign with images
router.post('/create', upload, async (req, res) => {
  try {
    const { creatorId, title, description, category, goalamt, deadline, isRecurring } = req.body;

    // Generate unique campaignId and sharecode
    const campaignId = uuidv4();
    const sharecode = uuidv4().slice(0, 8); // Short shareable code

    // Get uploaded image URLs
    const imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);

    const newCampaign = new Campaign({
      campaignId,
      creatorId,
      title,
      description,
      category,
      goalamt: isRecurring ? null : goalamt, // If recurring, no goal amount
      deadline: isRecurring ? null : deadline, // If recurring, no deadline
      isRecurring,
      sharecode,
      images: imageUrls // Store image URLs in DB
    });

    await newCampaign.save();
    res.status(201).json({ success: true, campaign: newCampaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all campaigns
router.get('/all', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a specific campaign by sharecode
router.get('/:sharecode', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ sharecode: req.params.sharecode });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.status(200).json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all campaigns
router.get('/all', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Get all campaigns for a specific user when logged in using thier userID
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const campaigns = await Campaign.find({ creatorId: userId });
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update a campaign (by campaignId or sharecode) - We'll use campaignId here
router.put('/update/:campaignId', upload, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updates = req.body;
    
    // If there are new images uploaded, update the images array
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
      updates.images = imageUrls;
    }
    
    const updatedCampaign = await Campaign.findOneAndUpdate({ campaignId }, updates, { new: true });
    if (!updatedCampaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, campaign: updatedCampaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a campaign (by campaignId)
router.delete('/delete/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const deletedCampaign = await Campaign.findOneAndDelete({ campaignId });
    if (!deletedCampaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
