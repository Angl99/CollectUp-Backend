const express = require("express");
const collectionRouter = express.Router();
const collectionController = require("../controllers/collectionController");

collectionRouter.get("/", collectionController.index);

collectionRouter.post("/", collectionController.create);

collectionRouter.get("/:id", collectionController.getById);

collectionRouter.delete("/:id", collectionController.deleteById);

// Add a product to a collection
collectionRouter.post("/add-product", collectionController.addProduct);

module.exports = collectionRouter;
