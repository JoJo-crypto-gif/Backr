const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    campaignId: { 
      type: String,
      required: true 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Comment', commentSchema);