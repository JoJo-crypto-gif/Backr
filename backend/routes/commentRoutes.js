const express = require("express")
const Comment = require("../models/comment")
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router()

// used campaign string UUID
router.get("/:campaignId", async (req, res) => {
  try {
    const comments = await Comment.find({ campaignId: req.params.campaignId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, comments })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch comments" })
  }
})

router.post("/:campaignId", ensureAuthenticated, async (req, res) => {
  try {
    const newComment = new Comment({
      campaignId: req.params.campaignId,
      userId: req.user._id,
      text: req.body.text,
    })

    await newComment.save()
    const populated = await newComment.populate("userId", "name avatar")
    res.status(201).json({ success: true, comment: populated })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to post comment" })
  }
})

module.exports = router
