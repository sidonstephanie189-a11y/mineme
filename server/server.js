require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected sa Database'))
  .catch(err => console.error('❌ Error:', err));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server tumatakbo sa port ${process.env.PORT}`);
});
