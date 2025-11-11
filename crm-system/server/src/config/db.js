const mongoose = require('mongoose');

const connectDB = async (uri) => {
  // 🧠 Build a dynamic connection URL that works both locally and in Docker
  const mongoHost = process.env.MONGO_HOST || 'localhost';
  const mongoPort = process.env.MONGO_PORT || '27017';
  const mongoDB = process.env.MONGO_DB || 'crm-db';

  // Prefer provided URI or MONGODB_URL; fallback to a composed one
  const mongoUri =
    uri ||
    process.env.MONGODB_URL ||
    `mongodb://${mongoHost}:${mongoPort}/${mongoDB}`;

  try {
    // Mongoose v7 no longer requires/accepts connection option flags like
    // useNewUrlParser/useUnifiedTopology. Keep connection simple and set
    // strictQuery explicitly to avoid deprecation warnings.
    mongoose.set('strictQuery', false)
    await mongoose.connect(mongoUri)

    console.log(`✅ MongoDB connected to ${mongoUri}`);

    // Extra connection event listeners for reliability
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
