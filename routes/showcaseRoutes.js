const express = require("express");
const showcaseRouter = express.Router();
const showcaseController = require("../controllers/showcaseController");

showcaseRouter.get("/", showcaseController.index);

showcaseRouter.post("/", showcaseController.create);

showcaseRouter.get("/:id", showcaseController.getById);

showcaseRouter.put("/:id", showcaseController.updateById);

showcaseRouter.put("/:id/items", showcaseController.addItemToShowcase);

showcaseRouter.delete("/:id", showcaseController.deleteById);

showcaseRouter.delete("/:id/items", showcaseController.deleteItemById);

module.exports = showcaseRouter;
