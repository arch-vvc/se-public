const Ticket = require('../models/ticket')
const mongoose = require('mongoose')

// GET /api/tickets
exports.getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const search = req.query.search
    const filter = {}
    if (search) {
      const re = new RegExp(search, 'i')
      filter.$or = [{ name: re }, { email: re }, { subject: re }]
    }

    const total = await Ticket.countDocuments(filter)
    const tickets = await Ticket.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ updatedAt: -1 })

    res.json({ data: tickets, meta: { total, page, limit } })
  } catch (err) {
    console.error('getAll tickets error:', err)
    res.status(500).json({ error: 'Failed to fetch tickets' })
  }
}

// GET /api/tickets/:id
exports.getOne = async (req, res) => {
  try {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' })
    const ticket = await Ticket.findById(id)
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    res.json({ data: ticket })
  } catch (err) {
    console.error('getOne ticket error:', err)
    res.status(500).json({ error: 'Failed to fetch ticket' })
  }
}

// POST /api/tickets
exports.create = async (req, res) => {
  try {
    const payload = req.body
    if (!payload || !payload.name || !payload.email || !payload.subject || !payload.description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    // enforce priority and status defaults/validation
    const priority = ['low', 'medium', 'high'].includes(payload.priority) ? payload.priority : 'low'
    const status = ['new', 'in-progress', 'resolved', 'escalated'].includes(payload.status) ? payload.status : 'new'

    const ticket = new Ticket({ ...payload, priority, status })
    await ticket.save()
    res.status(201).json({ data: ticket })
  } catch (err) {
    console.error('create ticket error:', err)
    res.status(500).json({ error: 'Failed to create ticket', details: err.message })
  }
}

// PUT /api/tickets/:id
exports.update = async (req, res) => {
  try {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' })
    const payload = { ...req.body }
    if (payload._id) delete payload._id
    payload.updatedAt = Date.now()
    // validate enums if provided
    if (payload.priority && !['low', 'medium', 'high'].includes(payload.priority)) delete payload.priority
    if (payload.status && !['new', 'in-progress', 'resolved', 'escalated'].includes(payload.status)) delete payload.status

    const ticket = await Ticket.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    res.json({ data: ticket })
  } catch (err) {
    console.error('update ticket error:', err)
    res.status(500).json({ error: 'Failed to update ticket', details: err.message })
  }
}

// DELETE /api/tickets/:id
exports.remove = async (req, res) => {
  try {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' })
    const ticket = await Ticket.findByIdAndDelete(id)
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
    res.json({ data: ticket })
  } catch (err) {
    console.error('remove ticket error:', err)
    res.status(500).json({ error: 'Failed to delete ticket' })
  }
}
