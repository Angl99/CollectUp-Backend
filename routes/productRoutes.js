const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");

// Get all products
productRouter.get("/", productController.getAllProducts);

// Create a new product
productRouter.post("/", productController.createProduct);

// Get a product by code (EAN, ISBN, or UPC)
productRouter.get("/:code", productController.getProductByCode);

// Update a product by EAN
productRouter.put("/:ean", productController.updateProductByEan);

// Delete a product by EAN
productRouter.delete("/:ean", productController.deleteProductByEan);

module.exports = productRouter;
