//routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const adminAuth = require('../middleware/adminAuth');
const Campaign = require('../models/campaign');

const router = express.Router();

/*
 * Create admin account
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

/*
 * Admin login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password || '');
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, admin });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Get all users (admin only)
 */
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/campaigns/:campaignId/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { campaignId } = req.params; // Change from :id to :campaignId

    // Validate the incoming status
    if (!['approved', 'banned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }
    
    // Find the campaign by campaignId and update its status
    const campaign = await Campaign.findOneAndUpdate(
      { campaignId }, // Change here: find by campaignId
      { status },
      { new: true } // Return the updated document
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ message: `Campaign status updated to ${status}`, campaign });
  } catch (err) {
    console.error('Update campaign status error:', err);
    res.status(500).json({ error: 'Failed to update campaign status' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a list of all campaigns (admin only)
router.get('/campaigns', adminAuth, async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('creatorId', 'name email');
    res.json(campaigns);
  } catch (err) {
    console.error('Fetch campaigns error:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

/*
 * Get total counts for dashboard (admin only)
 */
router.get('/dashboard-metrics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const pendingCampaigns = await Campaign.countDocuments({ status: 'pending' });
    const approvedCampaigns = await Campaign.countDocuments({ status: 'approved' });

    res.json({
      totalUsers,
      totalCampaigns,
      pendingCampaigns,
      approvedCampaigns
    });
  } catch (err) {
    console.error('Fetch dashboard metrics error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

router.get('/campaigns', adminAuth, async (req, res) => {
  try {
    // Fetch all campaigns, regardless of status
    const campaigns = await Campaign.find({})
      .populate('creatorId', 'name avatar bio')
      .exec();
    res.json(campaigns);
  } catch (err) {
    console.error('Fetch all campaigns for admin error:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

/*
 * Get all users for admin review (admin only)
 */
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error('Fetch all users for admin error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


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

module.exports = router;
