const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Kunin ang info ng user
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// DAILY SIGN-IN BONUS
router.post('/daily-bonus', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  const today = new Date().toDateString();
  const lastClaim = user.lastDailyClaim
    ? new Date(user.lastDailyClaim).toDateString()
    : null;

  if (lastClaim === today) {
    return res.status(400).json({
      msg: '✅ Nakuha mo na ang bonus ngayon! Bukas na lang ulit!'
    });
  }

  const dailyBonus = Number(process.env.DAILY_BONUS) || 5;
  user.balance += dailyBonus;
  user.lastDailyClaim = new Date();
  await user.save();

  res.json({
    msg: `🎉 Matagumpay! +₱${dailyBonus} ay idinagdag sa iyong balanse!`,
    newBalance: user.balance
  });
});

module.exports = router;
