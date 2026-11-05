const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// REGISTER — may ₱50 bonus!
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check kung may email na
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'Email na ito ay nakarehistro na' });
    }

    // ₱50 registration bonus
    const regBonus = Number(process.env.REG_BONUS) || 50;

    // Gumawa ng bagong user
    const user = await User.create({
      name,
      email,
      password,
      balance: regBonus
    });

    res.status(201).json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        role: user.role
      },
      message: `✅ Matagumpay nakagawa ng account! ₱${regBonus} bonus ay idinagdag!`
    });
  } catch (error) {
    res.status(500).json({ msg: 'May naganap na error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ msg: 'Hindi nakita ang email' });
  }

  const match = await user.matchPassword(password);
  if (!match) {
    return res.status(401).json({ msg: 'Maling password' });
  }

  res.json({
    token: signToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      role: user.role
    }
  });
});

module.exports = router;
