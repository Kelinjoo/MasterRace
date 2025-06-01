const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db'); // Just loading the DB connection
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const partRoutes = require('./routes/partRoutes');
const buildRoutes = require('./routes/buildRoutes'); 
const userRoutes = require('./routes/userRoutes');



dotenv.config(); // Load environment variables

const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/builds', buildRoutes); 
app.use('/api/users', userRoutes);





// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

//test db
/// Temp change to trigger fresh Railway deploy

app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT 1');
    connection.release(); // VERY IMPORTANT
    res.json({ db: 'connected', result: rows });
  } catch (err) {
    console.error('❌ DB test failed:', err);
    res.status(500).json({ error: 'DB connection failed' });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

