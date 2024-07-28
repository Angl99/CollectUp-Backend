const { prisma } = require('../helpers/prismaDbHelper')

const collectionController = {
  // Get all collections
  index: async (req, res) => {
    try {
      const collections = await prisma.collection.findMany({
        include: { products: { include: { product: true } } }
      });
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch collections' });
    }
  },

  // Create a new collection
  create: async (req, res) => {
    try {
      const { name } = req.body;
      const newCollection = await prisma.collection.create({
        data: { name },
      });
      res.status(201).json(newCollection);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create collection' });
    }
  },

  // Add a product to a collection
  addProduct: async (req, res) => {
    try {
      const { collectionId, productEan } = req.body;

      // Check if the product exists
      const product = await prisma.product.findUnique({
        where: { ean: productEan }
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if the collection exists
      const collection = await prisma.collection.findUnique({
        where: { id: parseInt(collectionId) }
      });

      if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }

      // Create the connection using CollectionProduct model
      const collectionProduct = await prisma.collectionProduct.create({
        data: {
          collection: { connect: { id: parseInt(collectionId) } },
          product: { connect: { ean: productEan } }
        }
      });

      // Fetch the updated collection with products
      const updatedCollection = await prisma.collection.findUnique({
        where: { id: parseInt(collectionId) },
        include: { products: { include: { product: true } } }
      });

      res.json(updatedCollection);
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Product already exists in this collection' });
      } else {
        res.status(500).json({ error: 'Failed to add product to collection' });
      }
    }
  },

  // Get a specific collection by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const collection = await prisma.collection.findUnique({
        where: { id: parseInt(id) },
        include: { products: { include: { product: true } } }
      });
      if (collection) {
        res.json(collection);
      } else {
        res.status(404).json({ error: 'Collection not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch collection' });
    }
  },

  // Delete a collection by ID
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.collection.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: 'Collection deleted!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete collection' });
    }
  },
};

module.exports = collectionController;
