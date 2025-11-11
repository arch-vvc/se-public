const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  source: { type: String },
  // Status field for tracking lead progress
  status: {
    type: String,
    enum: ["new", "in-progress", "escalated", "resolved"],
    default: "new",
  },
  // Assigned sales representative id (optional) — stored so Lead Management assignments persist
  assignedTo: { type: String },
  // Optional human-readable assigned rep name for convenience
  assignedToName: { type: String },
  // Track if lead has been converted to opportunity
  converted: { type: Boolean, default: false },
  convertedAt: { type: Date },
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

LeadSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Lead", LeadSchema);
