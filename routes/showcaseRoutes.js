const express = require("express");
const showcaseRouter = express.Router();
const showcaseController = require("../controllers/showcaseController");

// Get all showcases
showcaseRouter.get("/", showcaseController.getAllShowcases);

// Create a new showcase
showcaseRouter.post("/", showcaseController.createShowcase);

// Get a showcase by ID
showcaseRouter.get("/:id", showcaseController.getShowcaseById);

// Update a showcase by ID
showcaseRouter.put("/:id", showcaseController.updateShowcaseById);

// Add items or collections to a showcase
showcaseRouter.put("/:id/items", showcaseController.addItemsToShowcase);

// Delete a showcase by ID
showcaseRouter.delete("/:id", showcaseController.deleteShowcaseById);

// Remove items or collections from a showcase
showcaseRouter.delete("/:id/items", showcaseController.removeItemsFromShowcase);

module.exports = showcaseRouter;
