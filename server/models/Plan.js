const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: String,
  description: String,
  minAmount: Number,
  maxAmount: Number,
  dailyROI: Number,
  durationDays: Number,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
