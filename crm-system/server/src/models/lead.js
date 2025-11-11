const mongoose = require('mongoose')

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  source: { type: String },
  // Assigned sales representative id (optional) — stored so Lead Management assignments persist
  assignedTo: { type: String },
  // Optional human-readable assigned rep name for convenience
  assignedToName: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

LeadSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Lead', LeadSchema)
