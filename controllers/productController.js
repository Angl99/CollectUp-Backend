const { prisma } = require('../helpers/prismaDbHelper');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      // Fetch all products from the database
      const products = await prisma.product.findMany();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    try {
      const { upc, isbn, ean, data } = req.body;
      // Create a new product in the database
      const newProduct = await prisma.product.create({
        data: { upc, isbn, ean, data },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  // Get a specific product by EAN, ISBN, or UPC
  getProductByCode: async (req, res) => {
    try {
      const { code } = req.params;
      // Find a product matching the given code
      const product = await prisma.product.findFirst({
        where: {
          OR: [
            { ean: code },
            { isbn: code },
            { upc: code }
          ]
        },
      });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  // Update a product by EAN
  updateProductByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      const { upc, isbn, data } = req.body;
      // Update the product in the database
      const updatedProduct = await prisma.product.update({
        where: { ean: ean },
        data: { upc, isbn, data },
      });
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  // Delete a product by EAN
  deleteProductByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      
      // Start a transaction to ensure all operations are performed or none
      await prisma.$transaction(async (prisma) => {
        // First, delete all associated ProductSeries entries
        await prisma.productSeries.deleteMany({
          where: { productEan: ean },
        });

        // Then delete the product
        await prisma.product.delete({
          where: { ean: ean },
        });
      });
      
      res.status(200).json({ message: 'Product and associated ProductSeries entries deleted!' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};

module.exports = productController;
