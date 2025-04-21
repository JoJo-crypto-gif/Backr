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


module.exports = router;
