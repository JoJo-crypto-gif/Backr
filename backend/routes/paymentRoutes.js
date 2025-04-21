const express = require('express');
const axios = require('axios');
const router = express.Router();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

// Test route
router.get('/test', (req, res) => {
  res.send('Payment route is working!');
});

// Initialize Payment
router.post('/initialize', async (req, res) => {
  const { email, amount, campaignId, name } = req.body;
  const reference = `${Math.floor(Math.random() * 1000000000)}`;

  const payload = {
    email,
    amount: amount * 100, // Paystack expects kobo
    reference,
    callback_url: `http://localhost:5173/payment-success?ref=${reference}`,
    metadata: {
      campaignId,
      name,
      email,
    }
  };

  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', payload, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ url: response.data.data.authorization_url });
  } catch (err) {
    console.error('Error initializing payment:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initialization failed', details: err.response?.data });
  }
});

// Verify Payment
router.get('/verify/:reference', async (req, res) => {
  const { reference } = req.params;

  try {
    const verifyRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`
      }
    });

    const data = verifyRes.data.data;

    if (data.status === 'success') {
      const amount = data.amount / 100;
      const campaignId = data.metadata?.campaignId;
      const name = data.metadata?.name;
      const email = data.metadata?.email;

      console.log("✅ Payment verified:", { amount, campaignId, name, email, reference });

      // ⚠️ No need to update the campaign here, it's handled in /record

      return res.status(200).json({
        status: 'success',
        data: {
          name,
          email,
          amount,
          reference,
          campaignId
        }
      });
    } else {
      console.error('❌ Payment not successful:', data);
      return res.status(400).json({ error: 'Payment not successful' });
    }

  } catch (err) {
    console.error('💥 Error verifying payment:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;
