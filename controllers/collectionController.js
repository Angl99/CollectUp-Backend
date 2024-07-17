const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const collectionController = {
  // Get all collections
  index: async (req, res) => {
    try {
      const collections = await prisma.collection.findMany();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch collections' });
    }
  },

  // Add an item to a collection
  addItem: async (req, res) => {
    try {
      const { collectionId, itemId } = req.body;
      const updatedCollection = await prisma.collection.update({
        where: { id: parseInt(collectionId) },
        data: {
          items: {
            connect: { id: parseInt(itemId) }
          }
        },
        include: { items: true }
      });
      res.json(updatedCollection);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add item to collection' });
    }
  },

  // Create a new collection
  create: async (req, res) => {
    try {
      const { name, showcaseId } = req.body;
      const newCollection = await prisma.collection.create({
        data: {
          name,
          showcaseId
        },
      });
      res.status(201).json(newCollection);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create collection' });
    }
  },

  // Get a specific collection by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const collection = await prisma.collection.findUnique({
        where: { id: parseInt(id) },
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

  // Update a collection by ID
  updateById: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, showcaseId } = req.body;
      const updatedCollection = await prisma.collection.update({
        where: { id: parseInt(id) },
        data: { name, showcaseId },
      });
      res.json(updatedCollection);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update collection' });
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
