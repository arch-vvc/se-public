const Customer = require('../models/customer')

// Basic contract:
// - Inputs: req.params.id, req.query (filter/pagination), req.body for create/update
// - Outputs: JSON responses { data, meta } or errors with proper HTTP codes

// GET /api/customers?limit=20&page=1&search=foo
exports.getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const search = req.query.search

    const filter = {}
    if (search) {
      const re = new RegExp(search, 'i')
      filter.$or = [{ name: re }, { email: re }, { company: re }]
    }

    const total = await Customer.countDocuments(filter)
    const customers = await Customer.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ updatedAt: -1 })

    res.json({ data: customers, meta: { total, page, limit } })
  } catch (err) {
    console.error('getAll customers error', err)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
}

// GET /api/customers/:id
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params
    const customer = await Customer.findById(id)
    if (!customer) return res.status(404).json({ error: 'Customer not found' })
    res.json({ data: customer })
  } catch (err) {
    console.error('getOne customer error', err)
    res.status(500).json({ error: 'Failed to fetch customer' })
  }
}

// POST /api/customers
exports.create = async (req, res) => {
  try {
    const payload = req.body
    if (!payload || !payload.name) {
      return res.status(400).json({ error: 'Missing required field: name' })
    }

    const customer = new Customer(payload)
    await customer.save()
    res.status(201).json({ data: customer })
  } catch (err) {
    console.error('create customer error', err)
    res.status(500).json({ error: 'Failed to create customer' })
  }
}

// PUT /api/customers/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body
    payload.updatedAt = Date.now()
    const customer = await Customer.findByIdAndUpdate(id, payload, { new: true })
    if (!customer) return res.status(404).json({ error: 'Customer not found' })
    res.json({ data: customer })
  } catch (err) {
    console.error('update customer error', err)
    res.status(500).json({ error: 'Failed to update customer' })
  }
}

// DELETE /api/customers/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params
    const customer = await Customer.findByIdAndDelete(id)
    if (!customer) return res.status(404).json({ error: 'Customer not found' })
    res.json({ data: customer })
  } catch (err) {
    console.error('remove customer error', err)
    res.status(500).json({ error: 'Failed to delete customer' })
  }
}
