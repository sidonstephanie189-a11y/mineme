const express = require('express');
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const router = express.Router();

// Kasaysayan ng transaksyon
router.get('/history', protect, async (req, res) => {
  try {
    const history = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: 'Error sa pagkuha ng kasaysayan' });
  }
});

// RECHARGE / DEPOSIT
router.post('/recharge', protect, async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Ilagay ang tamang halaga' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'deposit',
      amount: Number(amount),
      status: 'pending',
      note: `Recharge gamit ang: ${method || 'Hindi tinukoy'}`
    });

    res.json({
      msg: '✅ Recharge request naipasa! Hintayin ang approval.',
      transaction
    });
  } catch (err) {
    res.status(500).json({ msg: 'Hindi makapagpadala ng request' });
  }
});

// WITHDRAW
router.post('/withdraw', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Ilagay ang tamang halaga' });
    }

    const user = await User.findById(req.user._id);
    if (amount > user.balance) {
      return res.status(400).json({ msg: '❌ Kulang ang balanse mo' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'withdraw',
      amount: Number(amount),
      status: 'pending'
    });

    res.json({
      msg: '✅ Withdrawal request naipasa! Hintayin ang approval.',
      transaction
    });
  } catch (err) {
    res.status(500).json({ msg: 'Hindi makapagpadala ng request' });
  }
});

module.exports = router;
