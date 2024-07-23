const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");

productRouter.get("/", productController.index);

productRouter.post("/", productController.create);

productRouter.get("/:code", productController.getByCode);

productRouter.put("/:ean", productController.updateByEan);

productRouter.delete("/:ean", productController.deleteByEan);

module.exports = productRouter;
