const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const productController = {
  // Get all products
  index: async (req, res) => {
    try {
      const products = await prisma.product.findMany();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  // Create a new product
  create: async (req, res) => {
    try {
      const { upc, isbn, ean, data } = req.body;
      const newProduct = await prisma.product.create({
        data: {
          upc,
          isbn,
          ean,
          data
        },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  // Get a specific product by EAN
  getByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      const product = await prisma.product.findUnique({
        where: { ean: parseInt(ean, 10) },
      });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  // Update a product by EAN
  updateByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      const { upc, isbn, data } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { ean: parseInt(ean, 10) },
        data: { upc, isbn, data },
      });
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  // Delete a product by EAN
  deleteByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      await prisma.product.delete({
        where: { ean: parseInt(ean, 10) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};

module.exports = productController;
