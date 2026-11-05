const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  value: Number,
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('RedemptionCode', codeSchema);
