const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  value: {
    type: Number,
    required: true,
    default: 0
  },
  stage: {
    type: String,
    enum: ['Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'Discovery'
  },
  expectedCloseDate: {
    type: Date
  },
  probability: {
    type: Number,
    default: 50 // percentage
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Deal', DealSchema);
