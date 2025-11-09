const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
// router file is named `customerRoutes.js` under routes/ — import the correct path
const customersRouter = require('./routes/customerRoutes');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customersRouter);
// Leads
try {
  const leadsRouter = require('./routes/leadRoutes')
  app.use('/api/leads', leadsRouter)
  console.log('✅ Registered /api/leads routes')
} catch (err) {
  console.error('❌ Could not register /api/leads routes', err && err.stack ? err.stack : err)
}

// backend
app.get('/', (req, res) => {
  res.send('<h2>CRM Backend is Running! </h2>');
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));


// Global error handler (always last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server (store instance so we can close it on shutdown)
let server;
const start = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown for Docker/nodemon (close HTTP server and mongoose)
const gracefulShutdown = async (signal) => {
  console.log(`🛑 ${signal} received - graceful shutdown`);
  try {
    // Stop accepting new connections
    if (server) {
      server.close(() => {
        console.log('✅ HTTP server closed');
      });
    }

    // Close DB connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');

    // Give server a moment to finish closing connections, then exit
    setTimeout(() => process.exit(0), 100);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

start();
