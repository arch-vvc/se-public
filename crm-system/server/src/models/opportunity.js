const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  issue: { type: String, required: true },
  contact: { type: String, required: true },
  history: [{ type: String }], // Array of order history strings
  stage: {
    type: String,
    enum: ["new", "inProgress", "escalated", "resolved"],
    default: "new",
  },
  order: { type: Number, default: 0 }, // For ordering within a stage
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

OpportunitySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Opportunity", OpportunitySchema);
