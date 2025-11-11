const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const path = require('path');

// Routers
const customersRouter = require('./routes/customerRoutes');
const leadsRouter = require('./routes/leadRoutes'); // ✅ added import
const ticketsRouter = require('./routes/ticketRoutes');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/leads', leadsRouter); // ✅ mounted leads routes
app.use('/api/tickets', ticketsRouter);

// Serve uploaded files (documents)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Backend home
app.get('/', (req, res) => {
  res.send('<h2>CRM Backend is Running! </h2>');
});

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

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

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`🛑 ${signal} received - graceful shutdown`);
  try {
    if (server) {
      server.close(() => console.log('✅ HTTP server closed'));
    }
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    setTimeout(() => process.exit(0), 100);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

start();
