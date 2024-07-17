const express = require("express");
const seriesRouter = express.Router();
const seriesController = require("../controllers/seriesController");

seriesRouter.get("/", seriesController.index);
seriesRouter.post("/", seriesController.create);
seriesRouter.get("/:id", seriesController.getById);
seriesRouter.put("/:id", seriesController.updateById);
seriesRouter.delete("/:id", seriesController.deleteById);

// New routes for ProductSeries
seriesRouter.get("/:id/products", seriesController.getSeriesProducts);
seriesRouter.post("/:id/products", seriesController.addProductToSeries);
seriesRouter.delete("/:id/products/:productEan", seriesController.removeProductFromSeries);

module.exports = seriesRouter;
