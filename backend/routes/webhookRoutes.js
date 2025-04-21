// crowdfunding/backend/routes/webhook.js
const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');
const Transaction = require('../models/transaction');

router.post('/paystack', async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const data = event.data;

    // Find campaign by campaignId in metadata
    const campaignId = data.metadata?.campaignId;
    const amountPaid = data.amount / 100; // Convert from kobo to GHS

    try {
      // Update campaign stats
      const campaign = await Campaign.findOne({ campaignId });
      if (campaign) {
        campaign.raisedAmount += amountPaid;
        campaign.backers += 1;
        await campaign.save();
      }

      // Optional: log transaction
      await Transaction.create({
        email: data.customer.email,
        name: data.metadata.name,
        amount: amountPaid,
        campaignId,
        reference: data.reference,
        status: data.status,
        date: new Date(),
      });

      return res.sendStatus(200);
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(500).send('Error handling webhook');
    }
  }

  res.sendStatus(200);
});

module.exports = router;
