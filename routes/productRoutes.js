const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");

productRouter.get("/", productController.index);

productRouter.post("/", productController.create);

productRouter.get("/:id", productController.getById);

productRouter.put("/:id", productController.updateById);

productRouter.delete("/:id", productController.deleteById);

module.exports = productRouter;
