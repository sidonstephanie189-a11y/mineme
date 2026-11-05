const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const Plan = require('../models/Plan');
const router = express.Router();

// Kunin lahat ng aktibong plans — para sa members
router.get('/', protect, async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: 'Error sa pagkuha ng plans' });
  }
});

// Gumawa ng bagong plan — admin lang
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ msg: '✅ Plan naitago na!', plan });
  } catch (err) {
    res.status(500).json({ msg: 'Hindi makagawa ng plan' });
  }
});

// I-update ang plan — admin lang
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ msg: 'Hindi nakita ang plan' });
    res.json({ msg: '✅ Plan na-update na!', plan });
  } catch (err) {
    res.status(500).json({ msg: 'Hindi ma-update ang plan' });
  }
});

// Burahin/itago ang plan — admin lang
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ msg: 'Hindi nakita ang plan' });
    res.json({ msg: '✅ Plan naitago na!' });
  } catch (err) {
    res.status(500).json({ msg: 'Hindi mabura ang plan' });
  }
});

module.exports = router;
