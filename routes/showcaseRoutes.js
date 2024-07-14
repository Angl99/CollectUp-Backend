const express = require("express");
const showcaseRouter = express.Router();
const showcaseController = require("../controllers/showcaseController");

showcaseRouter.get("/", showcaseController.index);

showcaseRouter.post("/", showcaseController.create);

showcaseRouter.get("/:id", showcaseController.getById);

showcaseRouter.put("/:id", showcaseController.updateById);

showcaseRouter.delete("/:id", showcaseController.deleteById);

module.exports = showcaseRouter;
