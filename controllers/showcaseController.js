const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getUserByUid } = require('../helpers/userHelper'); // Updated path

const showcaseController = {
  // Get all showcases
  index: async (req, res) => {
    try {
      const showcases = await prisma.showcase.findMany({
        include: { items: true, collections: true },
      });
      res.json(showcases);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch showcases' });
    }
  },

  // Create a new showcase
  create: async (req, res) => {
    try {
      const { name, uid } = req.body;
      const user = await getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newShowcase = await prisma.showcase.create({
        data: { name, userId: user.id },
      });
      res.status(201).json(newShowcase);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create showcase' });
    }
  },

  // Get a specific showcase by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const showcase = await prisma.showcase.findUnique({
        where: { id: parseInt(id, 10) },
        include: { items: true, collections: true },
      });
      if (showcase) {
        res.json(showcase);
      } else {
        res.status(404).json({ error: 'Showcase not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch showcase' });
    }
  },

  // Update a showcase by ID
  updateById: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedShowcase = await prisma.showcase.update({
        where: { id: parseInt(id, 10) },
        data: { name },
      });
      res.json(updatedShowcase);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update showcase' });
    }
  },

  // Add items or collections to a showcase
  addItemToShowcase: async (req, res) => {
    try {
      const { id } = req.params;
      const items = req.body;

      const showcaseId = parseInt(id, 10);

      for (const item of items) {
        if (item.type === 'Item') {
          await prisma.item.update({
            where: { id: parseInt(item.id, 10) },
            data: { showcaseId },
          });
        } else if (item.type === 'Collection') {
          await prisma.collection.update({
            where: { id: parseInt(item.id, 10) },
            data: { showcaseId },
          });
        }
      }

      const updatedShowcase = await prisma.showcase.findUnique({
        where: { id: showcaseId },
        include: { items: true, collections: true },
      });

      res.json(updatedShowcase);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add items/collections to showcase' });
    }
  },

  // Delete a showcase by ID
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.showcase.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete showcase' });
    }
  },

  // Remove items or collections from a showcase
  deleteItemById: async (req, res) => {
    try {
      const { id } = req.params;
      const items = req.body;

      for (const item of items) {
        if (item.type === 'Item') {
          await prisma.item.update({
            where: { id: parseInt(item.id, 10) },
            data: { showcaseId: null },
          });
        } else if (item.type === 'Collection') {
          await prisma.collection.update({
            where: { id: parseInt(item.id, 10) },
            data: { showcaseId: null },
          });
        }
      }

      const updatedShowcase = await prisma.showcase.findUnique({
        where: { id: parseInt(id, 10) },
        include: { items: true, collections: true },
      });

      res.json(updatedShowcase);
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove items/collections from showcase' });
    }
  },
};

module.exports = showcaseController;
