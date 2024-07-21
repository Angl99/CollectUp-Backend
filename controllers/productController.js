const { prisma } = require('../helpers/prismaDbHelper')


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
        console.log(error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  // Get a specific product by EAN
  getByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      const product = await prisma.product.findUnique({
        where: { ean: ean },
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
        where: { ean: ean },
        data: { upc, isbn, data },
      });
      res.json(updatedProduct);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  // Delete a product by EAN
  deleteByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      
      // First, delete all associated ProductSeries entries
      await prisma.productSeries.deleteMany({
        where: { productEan: ean },
      });

      // Then delete the product
      await prisma.product.delete({
        where: { ean: ean },
      });
      
      res.status(200).json({ message: 'Product and associated ProductSeries entries deleted!'});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};

module.exports = productController;
