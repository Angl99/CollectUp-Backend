const express = require("express");
const seriesRouter = express.Router();
const seriesController = require("../controllers/seriesController");

seriesRouter.get("/", seriesController.index);

seriesRouter.post("/", seriesController.create);

seriesRouter.get("/:id", seriesController.getById);

seriesRouter.put("/:id", seriesController.updateById);

seriesRouter.delete("/:id", seriesController.deleteById);

module.exports = seriesRouter;
