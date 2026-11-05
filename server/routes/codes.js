const express = require('express');
const { protect } = require('../middleware/auth');
const RedemptionCode = require('../models/RedemptionCode');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

// GUMAMIT NG REDEMPTION CODE
router.post('/redeem', protect, async (req, res) => {
  try {
    const { code } = req.body;

    // Hanapin ang code — gawing malaki ang letra para tumugma
    const foundCode = await RedemptionCode.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!foundCode) {
      return res.status(404).json({ msg: '❌ Hindi kilalang code' });
    }

    // Suriin kung ubos na ang gamit
    if (foundCode.usedCount >= foundCode.usageLimit) {
      return res.status(400).json({ msg: '❌ Ubos na ang paggamit ng code na ito' });
    }

    // Idagdag sa balanse ng user
    const user = await User.findById(req.user._id);
    user.balance += foundCode.value;
    foundCode.usedCount += 1;

    await user.save();
    await foundCode.save();

    // Itala ang transaksyon
    await Transaction.create({
      user: user._id,
      type: 'code',
      amount: foundCode.value,
      note: `Code: ${code.toUpperCase()}`
    });

    res.json({
      msg: `🎉 Matagumpay! +₱${foundCode.value} ay idinagdag sa iyong balanse!`,
      newBalance: user.balance
    });
  } catch (err) {
    res.status(500).json({ msg: 'May naganap na error sa pag-redeem' });
  }
});

module.exports = router;
