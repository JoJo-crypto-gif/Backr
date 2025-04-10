const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaignId: { type: String, unique: true, required: true }, // Unique identifier
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to User
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  goalamt: { type: Number, default: 0 }, // Goal amount (if applicable)
  raisedamt: { type: Number, default: 0 }, // Amount raised
  deadline: { type: Date }, // Optional for non-recurring
  isRecurring: { type: Boolean, default: false }, // Recurring or not
  sharecode: { type: String, unique: true, required: true }, // Unique shareable code
  backers: { type: Number, default: 0 },
  story: {type: String, required: true},
  images: { type: [String] }, // Change from single image to an array
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
