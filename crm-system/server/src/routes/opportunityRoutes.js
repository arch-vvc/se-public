const express = require("express");
const router = express.Router();
const opportunityController = require("../controllers/opportunitiesController");

// CRUD routes
router.get("/", opportunityController.getAll);
router.get("/:id", opportunityController.getOne);
router.post("/", opportunityController.create);
router.put("/:id", opportunityController.update);
router.put("/:id/stage", opportunityController.updateStage);
router.delete("/:id", opportunityController.remove);

module.exports = router;
