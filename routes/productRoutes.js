const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");

// Get all products
productRouter.get("/", productController.getAllProducts);

// Create a new product
productRouter.post("/", productController.createProduct);

// Get a product by EAN
productRouter.get("/:ean", productController.getProductByEan);

// Update a product by EAN
productRouter.put("/:ean", productController.updateProductByEan);

// Delete a product by EAN
productRouter.delete("/:ean", productController.deleteProductByEan);

module.exports = productRouter;
