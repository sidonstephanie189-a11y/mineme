const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdraw', 'bonus', 'code', 'earning'] },
  amount: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'completed' },
  note: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
