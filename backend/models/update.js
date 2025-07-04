const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema(
  {
    campaignId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Update = mongoose.model('Update', updateSchema);
module.exports = Update;
