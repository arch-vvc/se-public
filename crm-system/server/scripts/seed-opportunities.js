const mongoose = require("mongoose");
const Opportunity = require("../src/models/opportunity");
require("dotenv").config();

const mongoHost = process.env.MONGO_HOST || "localhost";
const mongoPort = process.env.MONGO_PORT || "27017";
const mongoDB = process.env.MONGO_DB || "crm-db";
const mongoUri =
  process.env.MONGODB_URL || `mongodb://${mongoHost}:${mongoPort}/${mongoDB}`;

const seedData = [
  {
    name: "Alice Johnson",
    issue: "Billing issue",
    contact: "alice.j@example.com",
    history: ["Order #1234 - $250", "Order #1256 - $180"],
    stage: "new",
    order: 0,
  },
  {
    name: "Bob Singh",
    issue: "Login failure",
    contact: "bob.s@example.com",
    history: ["Order #1201 - $90"],
    stage: "new",
    order: 1,
  },
  {
    name: "Daniel Kim",
    issue: "Payment declined",
    contact: "daniel.k@example.com",
    history: ["Order #1300 - $75"],
    stage: "new",
    order: 2,
  },
  {
    name: "Chitra Rao",
    issue: "Feature request",
    contact: "chitra.r@example.com",
    history: ["Order #1199 - $300", "Order #1220 - $150"],
    stage: "inProgress",
    order: 0,
  },
  {
    name: "Elena Garcia",
    issue: "Shipping delay",
    contact: "elena.g@example.com",
    history: ["Order #1288 - $200", "Order #1299 - $120"],
    stage: "inProgress",
    order: 1,
  },
  {
    name: "Farhan Ali",
    issue: "Account locked",
    contact: "farhan.a@example.com",
    history: ["Order #1277 - $95"],
    stage: "escalated",
    order: 0,
  },
  {
    name: "Grace Lee",
    issue: "Refund processed",
    contact: "grace.l@example.com",
    history: ["Order #1310 - $150"],
    stage: "resolved",
    order: 0,
  },
];

async function seedOpportunities() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Check if opportunities already exist
    const existingCount = await Opportunity.countDocuments();

    if (existingCount > 0) {
      console.log(
        `⚠️  Database already has ${existingCount} opportunities. Skipping seed.`
      );
      console.log("   To re-seed, delete the opportunities collection first.");
    } else {
      await Opportunity.insertMany(seedData);
      console.log(`✅ Successfully seeded ${seedData.length} opportunities!`);
    }

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedOpportunities();
