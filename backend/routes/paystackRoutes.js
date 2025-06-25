const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/verify/:reference", async (req, res) => {
  const reference = req.params.reference;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = response.data.data;

    if (data.status === "success") {
      const amount = data.amount / 100;
      const email = data.customer.email;
      const name = data.metadata?.name || "Anonymous";
      const campaignId = data.metadata?.campaignId;

      // ✅ Console log inside the block where variables are defined
      console.log("Paystack verification data:", data);
      console.log("Returning to frontend:", {
        name,
        email,
        amount,
        reference,
        campaignId
      });

      return res.json({
        status: "success",
        data: {
          amount,
          email,
          name,
          campaignId,
          reference: data.reference,
        },
      });
    }

    res.status(400).json({ status: "failed", message: "Payment not successful" });
  } catch (err) {
    console.error("Paystack verification failed:", err.message);
    res.status(500).json({ status: "error", message: "Could not verify payment" });
  }
});

// Create transfer recipient
router.post('/create-recipient', async (req, res) => {
  const { type, name, phone, network, account_number, bank_code } = req.body;

  let payload = {
    type,
    name,
    currency: "GHS"
  };

  if (type === 'mobile_money') {
    payload.details = {
      phone_number: phone,
      provider: network.toLowerCase() // e.g., mtn, airtel, tigo
    };
  } else if (type === 'ghana_bank') {
    payload.details = {
      account_number,
      bank_code
    };
  } else {
    return res.status(400).json({ error: 'Unsupported payout type' });
  }

  try {
    const response = await axios.post('https://api.paystack.co/transferrecipient', payload, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    const recipient = response.data.data;
    console.log('✅ Transfer recipient created:', recipient);

    res.json({ recipient });
  } catch (err) {
    console.error('❌ Error creating recipient:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create recipient' });
  }
});


module.exports = router;
