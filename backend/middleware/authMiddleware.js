// middleware/authMiddleware.js
const Campaign = require('../models/campaign'); // We'll need this for checking campaign ownership

// Middleware to check if a user is authenticated (logged in)
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // Passport.js adds this method to req
        return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    // If not authenticated, send a 401 Unauthorized response
    res.status(401).json({ success: false, message: 'Unauthorized: Please log in to perform this action.' });
};

// Middleware to check if the logged-in user is the creator of the campaign
const isCampaignCreator = async (req, res, next) => {
    try {
        const { campaignId } = req.params; // Get campaignId from route parameters
        const campaign = await Campaign.findOne({ campaignId });

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found.' });
        }

        // Check if the authenticated user's ID matches the campaign's creatorId
        // Convert to string for reliable comparison with Mongoose ObjectIds
        if (req.user && campaign.creatorId.toString() === req.user._id.toString()) {
            return next(); // User is the creator, proceed
        } else {
            // Not the creator, send a 403 Forbidden response
            return res.status(403).json({ success: false, message: 'Forbidden: You are not authorized to modify this campaign.' });
        }
    } catch (error) {
        // Log the error (using req.app.get('logger') if setup, otherwise console.error)
        // For now, let's use console.error for simplicity, then transition to Winston later
        console.error('Error in isCampaignCreator middleware:', error);
        res.status(500).json({ success: false, message: 'Server error during authorization check.' });
    }
};

module.exports = { isAuthenticated, isCampaignCreator };