const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Campaign = require('../models/campaign');

// POST /api/transactions/record
router.post('/record', async (req, res) => {
  try {
    const { campaignId, name, email, amount, reference, status } = req.body;

    if (!campaignId || !name || !email || !amount || !reference || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid donation amount." });
    }

    // Check for duplicate reference (avoid saving same transaction twice)
    const existing = await Transaction.findOne({ reference });
    if (existing) {
      return res.status(200).json({ success: true, message: "Transaction already recorded." });
    }

    const transaction = new Transaction({
      campaignId,
      name,
      email,
      amount: numericAmount,
      reference,
      status
    });

    await transaction.save();

    // If payment was successful, update campaign
    if (status === 'success') {
      const updatedCampaign = await Campaign.findOneAndUpdate(
        { campaignId },
        {
          $inc: { raisedamt: numericAmount, backers: 1 }
        },
        { new: true }
      );

      if (!updatedCampaign) {
        console.warn("Campaign not found to update:", campaignId);
        return res.status(404).json({ success: false, message: "Campaign not found." });
      }

      console.log("✅ Campaign updated:", updatedCampaign.title);
    }

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    console.error("🚨 Error recording transaction:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/transactions/:campaignId
router.get('/:campaignId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ campaignId: req.params.campaignId });
    res.status(200).json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
