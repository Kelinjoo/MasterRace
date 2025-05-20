const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ THIS is the test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
  });
  
  
