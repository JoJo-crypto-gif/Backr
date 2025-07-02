// routes/withdrawalRoutes.js
const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/withdrawal');
const User = require('../models/user');

// POST /withdrawals/request
router.post('/request', async (req, res) => {
  try {
    const { userId, amount, type, details } = req.body;

    // 1. Validate required fields
    if (!userId || !amount || !type || !details) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 3. Check balance
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // 4. Deduct balance immediately
    user.balance -= amount;
    await user.save();

    // 5. Create withdrawal record
    const newWithdrawal = new Withdrawal({
      userId,
      amount,
      type,
      details, // E.g. { phone, provider } or { account_number, bank_code }
      status: 'pending',
    });

    await newWithdrawal.save();

    console.log(`💸 Withdrawal request created for ${user.email}: GHS ${amount}`);
    res.status(201).json({ success: true, withdrawal: newWithdrawal });

  } catch (error) {
    console.error('❌ Error creating withdrawal:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
