// payments routes

const express = require('express');
const axios = require('axios');
const router = express.Router();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

// Test route
router.get('/test', (req, res) => {
    res.send('Payment route is working!');
});

// Initialize Payment
router.post('/initialize', async (req, res, next) => { // <-- ADDED 'next' here
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

        // <-- CHANGED: Replaced console.log with Winston logger
        req.app.locals.logger.info(`Paystack payment initialization successful. Reference: ${reference}, Campaign: ${campaignId}`);

        res.json({ url: response.data.data.authorization_url });
    } catch (err) {
        // <-- CHANGED: Replaced console.error with Winston logger and passed to central error handler
        req.app.locals.logger.error('Error initializing Paystack payment:', {
            message: err.message,
            status: err.response?.status,
            paystackResponse: err.response?.data // Log Paystack's raw response for debugging
        });
        next(err); // Pass error to the central error handling middleware in server.js
    }
});

// Verify Payment
router.get('/verify/:reference', async (req, res, next) => { // <-- ADDED 'next' here
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

            // <-- CHANGED: Replaced console.log with Winston logger
            req.app.locals.logger.info("✅ Payment verified successfully:", { amount, campaignId, name, email, reference });

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
            // <-- CHANGED: Replaced console.error with Winston logger (warn level for non-success)
            req.app.locals.logger.warn('❌ Paystack payment not successful (status not success):', { reference, status: data.status, paystackData: data });
            return res.status(400).json({ error: 'Payment not successful' });
        }

    } catch (err) {
        // <-- CHANGED: Replaced console.error with Winston logger and passed to central error handler
        req.app.locals.logger.error('💥 Error verifying Paystack payment:', {
            message: err.message,
            status: err.response?.status,
            paystackResponse: err.response?.data,
            reference: reference
        });
        next(err); // Pass error to the central error handling middleware in server.js
    }
});

module.exports = router;