const express = require('express');
const jwt = require('jsonwebtoken');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const RedemptionCode = require('../models/RedemptionCode');
const router = express.Router();

// Admin login — gamit ang email at password mula sa .env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Tugma sa .env admin
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token, role: 'admin', msg: '✅ Admin nakapasok na!' });
  }

  // O kaya user na may role na admin sa database
  const user = await User.findOne({ email });
  if (user && user.role === 'admin' && await user.matchPassword(password)) {
    const token = jwt.sign({ role: 'admin', id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token, role: 'admin', msg: '✅ Admin nakapasok na!' });
  }

  res.status(401).json({ msg: '❌ Maling admin credentials' });
});

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const pendingTx = await Transaction.countDocuments({ status: 'pending' });
  res.json({ totalUsers, pendingTransactions: pendingTx });
});

// Lahat ng users
router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('-password');
  res.json(users);
});

// Ayusin ang balanse ng user
router.patch('/users/:id/adjust', protect, adminOnly, async (req, res) => {
  const { amount, note } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ msg: '❌ Hindi nakita ang user' });

  user.balance += Number(amount);
  await user.save();

  await Transaction.create({
    user: req.params.id,
    type: 'bonus',
    amount: Number(amount),
    note: note || 'Admin adjustment'
  });

  res.json({ msg: '✅ Balanse na-update na!', newBalance: user.balance });
});

// Aprubahan/tanggihan ang transaksyon
router.patch('/transactions/:id', protect, adminOnly, async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!transaction) return res.status(404).json({ msg: '❌ Hindi nakita ang transaksyon' });
  res.json({ msg: '✅ Status na-update na!', transaction });
});

// Gumawa ng redemption code
router.post('/codes', protect, adminOnly, async (req, res) => {
  const code = await RedemptionCode.create(req.body);
  res.status(201).json({ msg: '✅ Code naitago na!', code });
});

// Lahat ng codes
router.get('/codes', protect, adminOnly, async (req, res) => {
  const codes = await RedemptionCode.find().sort({ createdAt: -1 });
  res.json(codes);
});

module.exports = router;
