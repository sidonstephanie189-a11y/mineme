const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Hindi ka nakapasok' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Maling token' });
  }
};

const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin lang ang pwede dito' });
  }
  next();
};

module.exports = { protect, adminOnly };
