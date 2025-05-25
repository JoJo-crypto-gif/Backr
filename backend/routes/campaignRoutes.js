// campaignRoutes.js

const express = require('express');
const multer = require('multer'); // Keep multer here for now, we'll refine it later
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Campaign = require('../models/campaign');

// NEW: Import validation functions and auth middleware
const { body, validationResult } = require('express-validator');
const { isAuthenticated, isCampaignCreator } = require('../middleware/authMiddleware'); // Path to your new middleware file

const router = express.Router();

// Multer setup for image uploads (Keep it here for now as you use it here)
// Make sure this 'uploads/' path corresponds to where your `server.js` serves static files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/campaigns/'); // Suggestion: Use a specific folder like 'uploads/campaigns/'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'), false); // Pass false to reject the file
    }
  }
}).array('images', 3); // max 3 images

// --- Validation Chains (New) ---
const validateCampaignCreation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Campaign title is required.')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Campaign description is required.')
        .isLength({ min: 20, max: 500 }).withMessage('Description must be between 20 and 500 characters.'),
    body('category')
        .notEmpty().withMessage('Campaign category is required.')
        .isIn(['Education', 'Medical', 'Community', 'Arts', 'Environment', 'Tech', 'Other']) // IMPORTANT: Match your schema enum here
        .withMessage('Invalid category provided.'),
    body('story')
        .trim()
        .notEmpty().withMessage('Campaign story is required.')
        .isLength({ min: 50, max: 5000 }).withMessage('Story must be between 50 and 5000 characters.'),
    body('isRecurring')
        .isBoolean().withMessage('isRecurring must be a boolean (true/false string).')
        .toBoolean(), // Convert string 'true'/'false' to actual boolean
    body('goalamt')
        .optional({ checkFalsy: true }) // Only validate if it exists and is not empty/null/0
        .isFloat({ min: 0 }).withMessage('Goal amount must be a non-negative number.'),
    body('deadline')
        .optional({ checkFalsy: true }) // Only validate if it exists
        .isISO8601().toDate().withMessage('Invalid deadline date format. Use YYYY-MM-DDTHH:MM:SSZ.'),
    // You might want to add a custom validator for deadline:
    // .custom((value, { req }) => {
    //     if (req.body.isRecurring === 'false' && value && new Date(value) <= new Date()) {
    //         throw new Error('Deadline must be in the future for non-recurring campaigns.');
    //     }
    //     return true;
    // }),
];

const validateCampaignUpdate = [
    body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters.'),
    body('description').optional().trim().isLength({ min: 20, max: 500 }).withMessage('Description must be between 20 and 500 characters.'),
    body('category').optional().isIn(['Education', 'Medical', 'Community', 'Arts', 'Environment', 'Tech', 'Other'])
        .withMessage('Invalid category provided.'),
    body('story').optional().trim().isLength({ min: 50, max: 5000 }).withMessage('Story must be between 50 and 5000 characters.'),
    body('isRecurring').optional().isBoolean().withMessage('isRecurring must be a boolean (true/false string).').toBoolean(),
    body('goalamt').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Goal amount must be a non-negative number.'),
    body('deadline').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Invalid deadline date format. Use YYYY-MM-DDTHH:MM:SSZ.'),
    // Custom validation for deadline might be more nuanced for updates
];


// --- Routes ---

// Create a new campaign
router.post('/create',
    isAuthenticated, // Check if user is logged in
    upload, // Handle file uploads
    validateCampaignCreation, // Validate request body
    async (req, res, next) => { // Add 'next' to the handler
        // Handle validation errors from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If validation fails, clean up any files that were uploaded by Multer
            if (req.files) {
                req.files.forEach(file => {
                    // Assuming your 'uploads/' path is relative to the project root
                    // Adjust path.join if 'uploads' is nested (e.g., '../uploads/campaigns')
                    const filePath = path.join(__dirname, '..', 'uploads', 'campaigns', file.filename);
                    require('fs').unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error(`Failed to delete uploaded file: ${filePath}, Error: ${unlinkErr.message}`);
                    });
                });
            }
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            // NEVER trust `creatorId` from `req.body` when user is authenticated!
            // It must come from `req.user._id` (set by Passport.js)
            const creatorId = req.user._id;

            const { title, description, category, story } = req.body;

            // These types are now correctly parsed by express-validator due to .toBoolean() and .toDate()
            // Make sure the names match exactly what express-validator processed (e.g., `req.body.isRecurring` will be a boolean)
            const isRecurring = req.body.isRecurring;
            const goalamt = isRecurring ? null : req.body.goalamt; // `goalamt` should be number if validated
            const deadline = isRecurring ? null : req.body.deadline; // `deadline` should be Date object if validated

            const campaignId = uuidv4();
            const sharecode = uuidv4().slice(0, 8); // Consider using a shorter, more readable ID like nanoid()

            // Get image URLs from uploaded files
            const imageUrls = req.files ? req.files.map(file => `http://localhost:5000/uploads/campaigns/${file.filename}`) : [];

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
            // Pass any other errors (e.g., Mongoose validation errors) to the central error handler
            next(err);
        }
    }
);

// Get all campaigns
router.get('/all', async (req, res, next) => { // Add 'next'
    try {
        const campaigns = await Campaign.find()
            .populate('creatorId', 'name avatar bio')
            .exec();
        res.status(200).json({ success: true, campaigns });
    } catch (err) {
        next(err); // Pass error to central handler
    }
});

// Get a specific campaign by campaignId
router.get('/:campaignId', async (req, res, next) => { // Add 'next'
    const { campaignId } = req.params;
    try {
        const campaign = await Campaign.findOne({ campaignId })
            .populate('creatorId', 'name avatar bio address')
            .exec();

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        res.status(200).json({ success: true, campaign });
    } catch (err) {
        next(err); // Pass error to central handler
    }
});

// Get a specific campaign by sharecode
router.get('/campaign/:sharecode', async (req, res, next) => { // Add 'next'
    try {
        const campaign = await Campaign.findOne({ sharecode: req.params.sharecode });

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        res.status(200).json({ success: true, campaign });
    } catch (err) {
        next(err); // Pass error to central handler
    }
});

// Get campaigns by user ID
router.get('/user/:userId', async (req, res, next) => { // Add 'next'
    try {
        const campaigns = await Campaign.find({ creatorId: req.params.userId });
        res.status(200).json({ success: true, campaigns });
    } catch (err) {
        next(err); // Pass error to central handler
    }
});

// Update a campaign
router.put('/update/:campaignId',
    isAuthenticated,    // Check if user is logged in
    isCampaignCreator,  // Check if user is the creator
    upload,             // Handle file uploads
    validateCampaignUpdate, // Validate request body for updates
    async (req, res, next) => { // Add 'next'
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, '..', 'uploads', 'campaigns', file.filename);
                    require('fs').unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error(`Failed to delete uploaded file: ${filePath}, Error: ${unlinkErr.message}`);
                    });
                });
            }
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { campaignId } = req.params;
            const updates = { ...req.body }; // Get updates from the validated body

            // Handle conversions for `isRecurring`, `goalamt`, `deadline` from validated data
            if (updates.hasOwnProperty('isRecurring')) {
                updates.isRecurring = updates.isRecurring; // Already boolean from validator
            }
            if (updates.hasOwnProperty('goalamt')) {
                updates.goalamt = updates.goalamt; // Already number from validator
            } else if (updates.hasOwnProperty('isRecurring') && updates.isRecurring === true) {
                updates.goalamt = null; // Clear if it becomes recurring and goalamt not provided
            }
            if (updates.hasOwnProperty('deadline')) {
                updates.deadline = updates.deadline; // Already Date object from validator
            } else if (updates.hasOwnProperty('isRecurring') && updates.isRecurring === true) {
                updates.deadline = null; // Clear if it becomes recurring and deadline not provided
            }


            if (req.files && req.files.length > 0) {
                // IMPORTANT: In a real app, you might want to remove old images when new ones are uploaded
                updates.images = req.files.map(file => `http://localhost:5000/uploads/campaigns/${file.filename}`);
            }

            // Find by campaignId AND creatorId for an extra layer of security and accuracy
            const updatedCampaign = await Campaign.findOneAndUpdate(
                { campaignId, creatorId: req.user._id },
                updates,
                { new: true, runValidators: true } // `new: true` returns the updated doc, `runValidators: true` applies schema validators on update
            );

            if (!updatedCampaign) {
                return res.status(404).json({ success: false, message: 'Campaign not found or you are not authorized to update it.' });
            }
            res.status(200).json({ success: true, campaign: updatedCampaign });
        } catch (err) {
            next(err); // Pass error to central handler
        }
    }
);

// Delete a campaign
router.delete('/delete/:campaignId',
    isAuthenticated,    // Check if user is logged in
    isCampaignCreator,  // Check if user is the creator
    async (req, res, next) => { // Add 'next'
        try {
            // Find and delete by campaignId AND creatorId for security
            const deletedCampaign = await Campaign.findOneAndDelete({ campaignId: req.params.campaignId, creatorId: req.user._id });

            if (!deletedCampaign) {
                return res.status(404).json({ success: false, message: 'Campaign not found or you are not authorized to delete it.' });
            }

            // OPTIONAL: Delete associated image files from disk
            if (deletedCampaign.images && deletedCampaign.images.length > 0) {
                deletedCampaign.images.forEach(imageUrl => {
                    const filename = path.basename(new URL(imageUrl).pathname); // Extract filename from URL
                    const filePath = path.join(__dirname, '..', 'uploads', 'campaigns', filename);
                    require('fs').unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error(`Failed to delete old campaign image file: ${filePath}, Error: ${unlinkErr.message}`);
                    });
                });
            }

            res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
        } catch (err) {
            next(err); // Pass error to central handler
        }
    }
);

module.exports = router;