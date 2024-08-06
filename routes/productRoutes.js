const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");

// Get all products
productRouter.get("/", productController.getAllProducts);

// Search products
productRouter.get("/search", productController.searchProducts);

// Create a new product
productRouter.post("/", productController.createProduct);

// Get a product by EAN
productRouter.get("/:ean", productController.getProductByEan);

// Update a product by EAN
productRouter.put("/:ean", productController.updateProductByEan);

// Delete a product by EAN
productRouter.delete("/:ean", productController.deleteProductByEan);

// Get all items for a specific product EAN
productRouter.get("/:ean/items", productController.getItemsByProductEan);

module.exports = productRouter;
