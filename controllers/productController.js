const { prisma } = require('../helpers/prismaDbHelper');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await prisma.product.findMany();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  // Search products
  searchProducts: async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const products = await prisma.product.findMany({
        where: {
          OR: [
            { data: { path: ['title'], string_contains: query, mode: 'insensitive' } },
            { data: { path: ['description'], string_contains: query, mode: 'insensitive' } },
            { data: { path: ['brand'], string_contains: query, mode: 'insensitive' } }
          ]
        }
      });
      console.log('Search query:', query);
      console.log('Found products:', products);

      res.json(products);
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Failed to search products' });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    try {
      const { ean, upc, isbn, data } = req.body;
      const newProduct = await prisma.product.create({
        data: { 
          ean, 
          upc, 
          isbn, 
          data 
        },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  // Get a specific product by EAN
  getProductByEan: async (req, res) => {
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
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  // Update a product by EAN
  updateProductByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      const { upc, isbn, data } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { ean: ean },
        data: { 
          upc, 
          isbn, 
          data 
        },
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
      
      await prisma.$transaction(async (prisma) => {
        await prisma.productSeries.deleteMany({
          where: { productEan: ean },
        });

        await prisma.product.delete({
          where: { ean: ean },
        });
      });
      
      res.status(200).json({ message: 'Product and associated ProductSeries entries deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};

module.exports = productController;
