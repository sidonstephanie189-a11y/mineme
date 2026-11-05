require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected sa Database'))
  .catch(err => console.error('❌ DB Error:', err));

// LAHAT NG ROUTES — 'to ang mahalaga!
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/codes', require('./routes/codes'));
app.use('/api/admin', require('./routes/admin'));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server tumatakbo sa port ${process.env.PORT}`);
});
