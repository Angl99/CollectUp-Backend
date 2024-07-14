const express = require("express");
const collectionRouter = express.Router();
const collectionController = require("../controllers/collectionController");

collectionRouter.get("/", collectionController.index);

collectionRouter.post("/", collectionController.create);

collectionRouter.get("/:id", collectionController.getById);

collectionRouter.put("/:id", collectionController.updateById);

collectionRouter.delete("/:id", collectionController.deleteById);

module.exports = collectionRouter;
