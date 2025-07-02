// models/withdrawal.js

const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['mobile', 'bank'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  details: { type: Object, required: true },
  paystackTransferCode: { type: String }, // ADD THIS LINE
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('withdrawal', withdrawalSchema);