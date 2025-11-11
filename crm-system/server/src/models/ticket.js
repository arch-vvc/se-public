const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true },
	subject: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
	status: { type: String, enum: ['new', 'in-progress', 'resolved', 'escalated'], default: 'new' },
}, { timestamps: true })

module.exports = mongoose.model('Ticket', ticketSchema)
