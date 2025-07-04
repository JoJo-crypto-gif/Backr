const express = require("express");
const multer = require("multer");
const path = require("path");
const Update = require("../models/update");
const ensureAuth = require("../middleware/auth");

const router = express.Router();

// Set up multer for single image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/updates/"); // Store images in /uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post("/:campaignId", ensureAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const { campaignId } = req.params;
    const imageUrl = req.file ? `http://localhost:5000/uploads/updates/${req.file.filename}` : null;

    const newUpdate = new Update({
      campaignId,
      title,
      content,
      image: imageUrl,
    });

    await newUpdate.save();

    res.status(201).json({ success: true, update: newUpdate });
  } catch (err) {
    console.error("Error creating update:", err);
    res.status(500).json({ success: false, message: "Failed to create update" });
  }
});

// ✅ GET /api/updates/:campaignId — Get updates for a campaign
router.get("/:campaignId", async (req, res) => {
  try {
    const updates = await Update.find({ campaignId: req.params.campaignId })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, updates });
  } catch (err) {
    console.error("Error fetching updates:", err);
    res.status(500).json({ success: false, message: "Failed to fetch updates" });
  }
});

module.exports = router;
