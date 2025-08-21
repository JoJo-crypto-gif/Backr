const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaignId: { type: String, unique: true, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  goalamt: { type: Number, default: 0 },
  raisedamt: { type: Number, default: 0 },
  deadline: { type: Date },
  isRecurring: { type: Boolean, default: false },
  sharecode: { type: String, unique: true, required: true },
  backers: { type: Number, default: 0 },
  story: {type: String, required: true},
  images: { type: [String] },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'banned'], 
    default: 'pending' 
  },
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;