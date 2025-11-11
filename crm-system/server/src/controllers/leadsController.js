const Lead = require("../models/lead");
const mongoose = require("mongoose");

// GET /api/leads
exports.getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const search = req.query.search;
    const filter = {};
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ name: re }, { email: re }, { source: re }];
    }

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ updatedAt: -1 });

    res.json({ data: leads, meta: { total, page, limit } });
  } catch (err) {
    console.error("getAll leads error:", err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

// GET /api/leads/:id
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" });
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ data: lead });
  } catch (err) {
    console.error("getOne lead error:", err);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
};

// POST /api/leads
exports.create = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.name) {
      return res.status(400).json({ error: "Missing required field: name" });
    }
    const lead = new Lead(payload);
    await lead.save();
    res.status(201).json({ data: lead });
  } catch (err) {
    console.error("create lead error:", err);
    res
      .status(500)
      .json({ error: "Failed to create lead", details: err.message });
  }
};

// PUT /api/leads/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" });
    const payload = { ...req.body };
    if (payload._id) delete payload._id;
    payload.updatedAt = Date.now();
    const lead = await Lead.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ data: lead });
  } catch (err) {
    console.error("update lead error:", err);
    res
      .status(500)
      .json({ error: "Failed to update lead", details: err.message });
  }
};

// DELETE /api/leads/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" });
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ data: lead });
  } catch (err) {
    console.error("remove lead error:", err);
    res.status(500).json({ error: "Failed to delete lead" });
  }
};

// POST /api/leads/:id/convert
exports.convertToOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the lead
    const Lead = require("../models/lead");
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Check if already converted
    if (lead.converted) {
      return res
        .status(400)
        .json({ error: "Lead has already been converted to an opportunity" });
    }

    // Create opportunity from lead data
    const Opportunity = require("../models/opportunity");

    const opportunityData = {
      name: lead.name,
      issue: req.body.issue || `Opportunity for ${lead.name}`,
      contact: lead.email || "No email provided",
      history: req.body.history || [],
      stage: "new",
      order: 0,
    };

    const opportunity = new Opportunity(opportunityData);
    await opportunity.save();

    // Mark lead as converted
    lead.converted = true;
    lead.convertedAt = Date.now();
    lead.opportunityId = opportunity._id;
    await lead.save();

    res.json({
      data: {
        lead,
        opportunity,
      },
      message: "Lead successfully converted to opportunity",
    });
  } catch (err) {
    console.error("convertToOpportunity error:", err);
    res.status(500).json({ error: "Failed to convert lead to opportunity" });
  }
};
