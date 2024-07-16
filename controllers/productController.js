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
      const { id, upc, isbn, ean, data } = req.body;
      const newProduct = await prisma.product.create({
        data: {
          id,
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

  // Get a specific product by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id, 10) },
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

  // Update a product by ID
  updateById: async (req, res) => {
    try {
      const { id } = req.params;
      const { upc, isbn, ean, data } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id, 10) },
        data: { upc, isbn, ean, data },
      });
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  // Delete a product by ID
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};

module.exports = productController;
