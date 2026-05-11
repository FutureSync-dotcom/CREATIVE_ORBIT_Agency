const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

// Middleware
app.use(express.json());

// Robust CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.length === 0) {
      // If no origins specified, allow all in development, but be careful in production
      return callback(null, true);
    }

    // Check if the origin matches any allowed origins (stripping trailing slashes for safety)
    const normalizedOrigin = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(allowed => allowed.replace(/\/$/, "") === normalizedOrigin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 10
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // In serverless, we don't want to exit the process, just throw so the request fails
    throw err;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ 
      error: 'Database Connection Error', 
      message: 'The server is currently unable to handle the request due to a database connection issue.' 
    });
  }
});

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
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/packages', require('./routes/packages'));

// Simple health check route
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date() }));

// Root route for visual confirmation
app.get('/', (req, res) => res.json({ 
  message: 'Creative Orbit Agency API', 
  status: 'Live',
  documentation: 'Check /api/auth, /api/projects, etc.'
}));

const PORT = process.env.PORT || 5001;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
