const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── MIDDLEWARE ──
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend + Admin
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ──
app.use('/api/auth',    require('./src/routes/auth'));
app.use('/api/workers', require('./src/routes/workers'));
app.use('/api/hirers',  require('./src/routes/hirers'));
app.use('/api/jobs',    require('./src/routes/jobs'));
app.use('/api/admin',   require('./src/routes/admin'));

// ── ROOT CHECK ──
app.get('/', (req, res) => {
  res.json({
    message: '⚡ RozgarConnect API is running!',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/workers', '/api/hirers', '/api/jobs', '/api/admin'],
  });
});

// ── 404 HANDLER ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Server error. Please try again.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n⚡ RozgarConnect Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`🔗 MongoDB: Connected\n`);
});
