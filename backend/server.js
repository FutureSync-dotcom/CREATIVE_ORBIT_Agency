const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();
let isDbConnected = false;
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

// Middleware
app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
}));

// Connect to MongoDB
const connectDB = async () => {
  if (isDbConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isDbConnected = true;
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/admins', require('./routes/admins'));

// Simple health check route
app.get('/health', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5001;

if (process.env.VERCEL !== '1') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch((err) => {
      console.error('Failed to start server:', err.message);
      process.exit(1);
    });
} else {
  connectDB().catch((err) => {
    console.error('MongoDB connection bootstrap error:', err.message);
  });
}

module.exports = app;
