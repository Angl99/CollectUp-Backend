const { prisma } = require('../helpers/prismaDbHelper');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await prisma.product.findMany();
      res.json({
        code: 'OK',
        total: products.length,
        offset: 0,
        items: products.map(product => formatProductResponse(product))
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ code: 'SERVER_ERR', message: 'Failed to fetch products' });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    try {
      const { ean, upc, isbn, title, description, brand, model, color, size, dimension, weight, category, images, offers } = req.body;
      const newProduct = await prisma.product.create({
        data: { 
          ean, 
          upc, 
          isbn, 
          title, 
          description, 
          brand, 
          model, 
          color, 
          size, 
          dimension, 
          weight, 
          category, 
          images, 
          offers 
        },
      });
      res.status(201).json({
        code: 'OK',
        total: 1,
        offset: 0,
        items: [formatProductResponse(newProduct)]
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ code: 'SERVER_ERR', message: 'Failed to create product' });
    }
  },

  // Get a specific product by EAN, ISBN, or UPC
  getProductByCode: async (req, res) => {
    try {
      const { code } = req.params;
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
        res.json({
          code: 'OK',
          total: 1,
          offset: 0,
          items: [formatProductResponse(product)]
        });
      } else {
        res.status(404).json({ code: 'NOT_FOUND', message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ code: 'SERVER_ERR', message: 'Failed to fetch product' });
    }
  },

  // Update a product by EAN
  updateProductByEan: async (req, res) => {
    try {
      const { ean } = req.params;
      const { upc, isbn, title, description, brand, model, color, size, dimension, weight, category, images, offers } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { ean: ean },
        data: { 
          upc, 
          isbn, 
          title, 
          description, 
          brand, 
          model, 
          color, 
          size, 
          dimension, 
          weight, 
          category, 
          images, 
          offers 
        },
      });
      res.json({
        code: 'OK',
        total: 1,
        offset: 0,
        items: [formatProductResponse(updatedProduct)]
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ code: 'SERVER_ERR', message: 'Failed to update product' });
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
      
      res.status(200).json({ code: 'OK', message: 'Product and associated ProductSeries entries deleted!' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ code: 'SERVER_ERR', message: 'Failed to delete product' });
    }
  },
};

function formatProductResponse(product) {
  return {
    ean: product.ean,
    title: product.title,
    upc: product.upc,
    description: product.description,
    brand: product.brand,
    model: product.model,
    color: product.color,
    size: product.size,
    dimension: product.dimension,
    weight: product.weight,
    category: product.category,
    images: product.images,
    offers: product.offers,
    // Add other fields as needed
  };
}

module.exports = productController;
