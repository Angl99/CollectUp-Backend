const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");

productRouter.get("/", productController.index);

productRouter.post("/", productController.create);

productRouter.get("/:ean", productController.getByEan);

productRouter.put("/:ean", productController.updateByEan);

productRouter.delete("/:ean", productController.deleteByEan);

module.exports = productRouter;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.index);

// Get a specific product by EAN, ISBN, or UPC
router.get('/:code', productController.getByCode);

// Create a new product
router.post('/', productController.create);

// Update a product by EAN
router.put('/:ean', productController.updateByEan);

// Delete a product by EAN
router.delete('/:ean', productController.deleteByEan);

module.exports = router;
