const Customer = require('../models/customer');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Parser } = require('json2csv');
const csv = require('csv-parser');

// ==========================
// CRUD OPERATIONS
// ==========================

// GET /api/customers?limit=20&page=1&search=foo
exports.getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const search = req.query.search;

    const filter = {};
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ name: re }, { email: re }, { company: re }];
    }

    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ updatedAt: -1 });

    res.json({ data: customers, meta: { total, page, limit } });
  } catch (err) {
    console.error('getAll customers error:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// GET /api/customers/:id
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ data: customer });
  } catch (err) {
    console.error('getOne customer error:', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

// POST /api/customers
exports.create = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const customer = new Customer(payload);
    await customer.save();
    res.status(201).json({ data: customer });
  } catch (err) {
    console.error('create customer error:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

// PUT /api/customers/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    payload.updatedAt = Date.now();

    const customer = await Customer.findByIdAndUpdate(id, payload, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    res.json({ data: customer });
  } catch (err) {
    console.error('update customer error:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

// DELETE /api/customers/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    res.json({ data: customer });
  } catch (err) {
    console.error('remove customer error:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

// ==========================
// CSV IMPORT / EXPORT
// ==========================

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// POST /api/customers/import
exports.importCustomers = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;
      const importedData = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => importedData.push(row))
        .on('end', async () => {
          // Bulk insert or update
          for (const data of importedData) {
            if (!data.email) continue; // skip invalid rows
            await Customer.findOneAndUpdate(
              { email: data.email },
              data,
              { upsert: true, new: true }
            );
          }

          fs.unlinkSync(filePath); // remove temp file
          res.json({
            message: 'Customers imported successfully',
            count: importedData.length
          });
        })
        .on('error', (err) => {
          console.error('CSV import error:', err);
          res.status(500).json({ error: 'Failed to import CSV file' });
        });
    } catch (err) {
      console.error('importCustomers error:', err);
      res.status(500).json({ error: 'Failed to import customers' });
    }
  }
];

// GET /api/customers/export
exports.exportCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().lean();
    if (!customers.length) {
      return res.status(404).json({ error: 'No customers to export' });
    }

    const fields = ['name', 'email', 'phone', 'company', 'address', 'createdAt', 'updatedAt'];
    const parser = new Parser({ fields });
    const csvData = parser.parse(customers);

    // ✅ Safer export path for Docker (write inside working directory)
    const exportDir = path.join(process.cwd(), 'exports');
    fs.mkdirSync(exportDir, { recursive: true });

    const filePath = path.join(exportDir, `customers_${Date.now()}.csv`);
    fs.writeFileSync(filePath, csvData);

    // ✅ Send file for download
    res.download(filePath, 'customers.csv', (err) => {
      if (err) {
        console.error('File download error:', err);
      } else {
        console.log(`✅ CSV exported successfully: ${filePath}`);
      }
      // Optional: delete file after sending
      // fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error('exportCustomers error:', err);
    res.status(500).json({ error: 'Failed to export customers' });
  }
};
