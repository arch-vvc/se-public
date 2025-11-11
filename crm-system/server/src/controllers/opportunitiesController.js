const Opportunity = require("../models/opportunity");

// GET /api/opportunities
exports.getAll = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({ stage: 1, order: 1 });
    res.json({ data: opportunities });
  } catch (err) {
    console.error("getAll opportunities error:", err);
    res.status(500).json({ error: "Failed to fetch opportunities" });
  }
};

// GET /api/opportunities/:id
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity)
      return res.status(404).json({ error: "Opportunity not found" });
    res.json({ data: opportunity });
  } catch (err) {
    console.error("getOne opportunity error:", err);
    res.status(500).json({ error: "Failed to fetch opportunity" });
  }
};

// POST /api/opportunities
exports.create = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.name || !payload.issue || !payload.contact) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, issue, contact" });
    }

    const opportunity = new Opportunity(payload);
    await opportunity.save();
    res.status(201).json({ data: opportunity });
  } catch (err) {
    console.error("create opportunity error:", err);
    res.status(500).json({ error: "Failed to create opportunity" });
  }
};

// PUT /api/opportunities/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    payload.updatedAt = Date.now();

    const opportunity = await Opportunity.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!opportunity)
      return res.status(404).json({ error: "Opportunity not found" });

    res.json({ data: opportunity });
  } catch (err) {
    console.error("update opportunity error:", err);
    res.status(500).json({ error: "Failed to update opportunity" });
  }
};

// PUT /api/opportunities/:id/stage
exports.updateStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, order } = req.body;

    if (!stage) {
      return res.status(400).json({ error: "Missing required field: stage" });
    }

    const opportunity = await Opportunity.findByIdAndUpdate(
      id,
      { stage, order: order || 0, updatedAt: Date.now() },
      { new: true }
    );

    if (!opportunity)
      return res.status(404).json({ error: "Opportunity not found" });

    res.json({ data: opportunity });
  } catch (err) {
    console.error("updateStage opportunity error:", err);
    res.status(500).json({ error: "Failed to update opportunity stage" });
  }
};

// DELETE /api/opportunities/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findByIdAndDelete(id);
    if (!opportunity)
      return res.status(404).json({ error: "Opportunity not found" });

    res.json({ data: opportunity });
  } catch (err) {
    console.error("remove opportunity error:", err);
    res.status(500).json({ error: "Failed to delete opportunity" });
  }
};
