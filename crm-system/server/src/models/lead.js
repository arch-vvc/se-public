const mongoose = require('mongoose')

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  source: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost'], default: 'new' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

LeadSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Lead', LeadSchema)
