//routes/paystackRoutes.js

const express = require("express");
const axios = require("axios");
const router = express.Router();
const Withdrawal = require('../models/withdrawal');
require('dotenv').config();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

// Paystack bank codes mapping for Ghana
const GHANA_BANK_CODES = {
  'access_bank': '044',
  'cal_bank': '084',
  'ecobank': '130',
  'fidelity_bank': '214',
  'first_national_bank': '328',
  'gcb_bank': '040',
  'gtbank': '058',
  'national_investment_bank': '061',
  'prudential_bank': '070',
  'republic_bank': '274',
  'societe_generale': '300',
  'standard_chartered': '068',
  'stanbic_bank': '306',
  'uba': '076',
  'universal_merchant_bank': '078',
  'zenith_bank': '057'
};

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

// Process a withdrawal (initiate Paystack transfer)
router.post('/withdrawals/process/:withdrawalId', async (req, res) => {
  const { withdrawalId } = req.params;

  try {
    const withdrawal = await Withdrawal.findById(withdrawalId).populate('userId');
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal already processed' });
    }

    console.log('🔍 Processing withdrawal:', withdrawal);

    // Prepare transfer recipient creation
    let recipientPayload;
    
    if (withdrawal.type === 'mobile') {
      const { phone, provider } = withdrawal.details;
      
      // Formating phone number for Ghana (replacing the 0 with +233)
      let formattedPhone = phone;
      if (phone.startsWith('0')) {
        formattedPhone = '233' + phone.substring(1);
      } else if (!phone.startsWith('233')) {
        formattedPhone = '233' + phone;
      }
      
      const providerMap = {
        'mtn': 'mtn',
        'vodafone': 'vod', 
        'airteltigo': 'tgo'
      };
      
      const paystackProvider = providerMap[provider.toLowerCase()] || provider.toLowerCase();
      
recipientPayload = {
  type: 'mobile_money',
  name: withdrawal.userId.name,
  currency: 'GHS',
  account_number: formattedPhone,
  provider: paystackProvider
};


    } else if (withdrawal.type === 'bank') {
      const { account_number, bank_code, bank_name } = withdrawal.details;
      
      // Use the bank code directly or map from bank name
      let finalBankCode = bank_code;
      if (!finalBankCode && bank_name) {
        finalBankCode = GHANA_BANK_CODES[bank_name.toLowerCase().replace(/\s+/g, '_')];
      }
      
      if (!finalBankCode) {
        return res.status(400).json({ 
          error: 'Invalid bank code. Please use a valid Ghana bank code.',
          supportedBanks: Object.keys(GHANA_BANK_CODES)
        });
      }

      recipientPayload = {
        type: 'nuban',
        name: withdrawal.userId.name,
        currency: 'GHS',
        details: {
          account_number: account_number,
          bank_code: finalBankCode
        }
      };

    } else {
      return res.status(400).json({ error: 'Unsupported withdrawal type' });
    }
console.log('🚨 Withdrawal Type:', withdrawal.type);


    console.log('📋 Creating recipient with payload:', JSON.stringify(recipientPayload, null, 2));

    // 1. Create transfer recipient
    const recipientRes = await axios.post('https://api.paystack.co/transferrecipient', recipientPayload, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    const recipientCode = recipientRes.data.data.recipient_code;
    console.log('✅ Recipient created:', recipientCode);

    // 2. Initiate the transfer
    const transferRes = await axios.post('https://api.paystack.co/transfer', {
      source: 'balance',
      amount: withdrawal.amount * 100, // Paystack expects amount in pesewas
      recipient: recipientCode,
      reason: `Withdrawal for ${withdrawal.userId.email}`
    }, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    const transferData = transferRes.data.data;

    // 3. Update withdrawal status
    withdrawal.status = 'success';
    withdrawal.paystackTransferCode = transferData.transfer_code;
    await withdrawal.save();

    console.log(`💸 Withdrawal of ₵${withdrawal.amount} processed for ${withdrawal.userId.email}`);

    res.status(200).json({
      success: true,
      message: 'Withdrawal processed successfully',
      transfer: transferData
    });

  } catch (error) {
    console.error('❌ Error processing withdrawal:', error.response?.data || error.message);

    // If withdrawal fails, mark as failed and restore user balance
    try {
      const withdrawal = await Withdrawal.findById(withdrawalId).populate('userId');
      if (withdrawal && withdrawal.status === 'pending') {
        withdrawal.status = 'failed';
        await withdrawal.save();
        
        // Restore user balance
        withdrawal.userId.balance += withdrawal.amount;
        await withdrawal.userId.save();
        
        console.log(`💰 Balance restored for ${withdrawal.userId.email}: +₵${withdrawal.amount}`);
      }
    } catch (restoreError) {
      console.error('❌ Error restoring balance:', restoreError.message);
    }

    res.status(500).json({
      error: 'Failed to process withdrawal',
      details: error.response?.data || error.message
    });
  }
});

// Get list of supported banks
router.get('/banks', async (req, res) => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?country=ghana', {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    });

    res.json({
      success: true,
      banks: response.data.data
    });
  } catch (error) {
    console.error('❌ Error fetching banks:', error.message);
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
});

module.exports = router;