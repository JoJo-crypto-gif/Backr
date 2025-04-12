const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Campaign = require('../models/campaign');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
}).array('images', 3); // max 3 images

// Create a new campaign
router.post('/create', upload, async (req, res) => {
  try {
    const { creatorId, title, description, category, story } = req.body;

    // Convert and handle types
    const isRecurring = req.body.isRecurring === 'true';
    const goalamt = isRecurring ? null : Number(req.body.goalamt);
    const deadline = isRecurring ? null : new Date(req.body.deadline);

    const campaignId = uuidv4();
    const sharecode = uuidv4().slice(0, 8);
    const imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);

    const newCampaign = new Campaign({
      campaignId,
      creatorId,
      title,
      description,
      category,
      goalamt,
      deadline,
      isRecurring,
      sharecode,
      story,
      images: imageUrls
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
    const campaigns = await Campaign.find()
      .populate('creatorId', 'name avatar bio')
      .exec();
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a specific campaign by campaignId
router.get('/:campaignId', async (req, res) => {
  const { campaignId } = req.params;

  try {
    // Use campaignId instead of _id for querying
    const campaign = await Campaign.findOne({ campaignId })
      .populate('creatorId', 'name avatar bio address')
      .exec();

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.status(200).json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a specific campaign by sharecode
router.get('/campaign/:sharecode', async (req, res) => {
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

// Get campaigns by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creatorId: req.params.userId });
    res.status(200).json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update a campaign
router.put('/update/:campaignId', upload, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updates = req.body;

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

// Delete a campaign
router.delete('/delete/:campaignId', async (req, res) => {
  try {
    const deletedCampaign = await Campaign.findOneAndDelete({ campaignId: req.params.campaignId });
    if (!deletedCampaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;