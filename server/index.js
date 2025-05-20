// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config(); // ✅ Load .env before anything else

const app = express();

const authRoutes = require('./routes/authRoutes'); // ✅ Load routes after app is declared

app.use(cors());
app.use(express.json());

// ✅ Mount auth routes
app.use('/api', authRoutes);

// ✅ Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
});
