const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  campaignId: { type: String, required: true }, // UUID from campaign.campaignId
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  },
  reference: { type: String, required: true, unique: true, index: true },
  currency: { type: String, default: 'GHS' } // optional
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
