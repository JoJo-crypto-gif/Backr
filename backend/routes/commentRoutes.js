const express = require('express');
const Comment = require('../models/comment');
const ensureAuth = require('../middleware/auth'); // <-- import it
const router = express.Router();

// Get comments for a campaign
router.get('/:campaignId', async (req, res) => {
  try {
    const comments = await Comment.find({ campaignId: req.params.campaignId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Post a new comment (only if logged in)
router.post('/:campaignId', ensureAuth, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Comment text is required.' });
  }

  try {
    const newComment = new Comment({
      campaignId: req.params.campaignId,
      userId: req.user._id, // comes from session
      text: text.trim(),
    });

    await newComment.save();
    const populatedComment = await newComment.populate('userId', 'name avatar');

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
