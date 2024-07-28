const { prisma } = require('../helpers/prismaDbHelper');
const { getUserByUid } = require('../helpers/userHelper');

const showcaseController = {
  // Get all showcases
  getAllShowcases: async (req, res) => {
    const { uid } = req.query
    try {
      // Fetch all showcases with their items and collections
      let showcases;
      if (uid) {
        const user = await getUserByUid(uid);
        if (user){
          showcases = await prisma.showcase.findMany({
            where: {userId: user.id},
            include: { items: true },
          });
        } else {
          res.status(400).json({error: "firebase id provided did not match any user"})
        }
      } else {
        showcases = await prisma.showcase.findMany({
          include: { items: true },
        });
      }
      
      res.json(showcases);
    } catch (error) {
      console.error('Error fetching showcases:', error);
      res.status(500).json({ error: 'Failed to fetch showcases' });
    }
  },

  // Create a new showcase
  createShowcase: async (req, res) => {
    try {
      const { name, uid } = req.body;
      // Get the user by their Firebase UID
      const user = await getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the user already has a showcase
      const existingShowcase = await prisma.showcase.findUnique({
        where: { userId: user.id },
      });

      if (existingShowcase) {
        return res.status(400).json({ error: 'User already has a showcase' });
      }

      // Create a new showcase for the user
      const newShowcase = await prisma.showcase.create({
        data: { name, userId: user.id },
      });
      res.status(201).json(newShowcase);
    } catch (error) {
      console.error('Error creating showcase:', error);
      res.status(500).json({ error: 'Failed to create showcase' });
    }
  },

  // Get a specific showcase by ID
  getShowcaseById: async (req, res) => {
    try {
      const { id } = req.params;
      // Find the showcase by its ID, including its items and collections
      const showcase = await prisma.showcase.findUnique({
        where: { id: parseInt(id, 10) },
        include: { items: {include: {product: true}}},
      });
      if (showcase) {
        res.json(showcase);
      } else {
        res.status(404).json({ error: 'Showcase not found' });
      }
    } catch (error) {
      console.error('Error fetching showcase:', error);
      res.status(500).json({ error: 'Failed to fetch showcase' });
    }
  },

  // Update a showcase by ID
  updateShowcaseById: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      // Update the showcase in the database
      const updatedShowcase = await prisma.showcase.update({
        where: { id: parseInt(id, 10) },
        data: { name },
      });
      res.json(updatedShowcase);
    } catch (error) {
      console.error('Error updating showcase:', error);
      res.status(500).json({ error: 'Failed to update showcase' });
    }
  },

  // Add items or collections to a showcase
  addItemsToShowcase: async (req, res) => {
    try {
      const { id } = req.params;
      const items = req.body;
      console.log(id, items);

      const showcaseId = parseInt(id, 10);

      // Start a transaction to ensure all operations are performed or none
      await prisma.$transaction(async (prisma) => {
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
      });

      // Fetch the updated showcase
      const updatedShowcase = await prisma.showcase.findUnique({
        where: { id: showcaseId },
        include: { items: true },
      });

      res.json(updatedShowcase);
    } catch (error) {
      console.error('Error adding items to showcase:', error);
      res.status(500).json({ error: 'Failed to add items/collections to showcase' });
    }
  },

  // Delete a showcase by ID
  deleteShowcaseById: async (req, res) => {
    try {
      const { id } = req.params;
      // Delete the showcase from the database
      await prisma.showcase.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting showcase:', error);
      res.status(500).json({ error: 'Failed to delete showcase' });
    }
  },

  // Remove items or collections from a showcase
  removeItemsFromShowcase: async (req, res) => {
    try {
      const { id } = req.params;
      const items = req.body;
      console.log('Removing items from showcase');

      console.log(id, items);

      // Start a transaction to ensure all operations are performed or none
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid items format. Expected an array.' });
      }

      await prisma.$transaction(async (p) => {
        for (const item of items) {
          console.log(item);
          if (item.type === 'Item') {
            await p.item.update({
              where: { id: parseInt(item.id, 10) },
              data: { showcase: { disconnect: { id: parseInt(id) } } },
            });
          } else if (item.type === 'Collection') {
            await p.collection.update({
              where: { id: parseInt(item.id, 10) },
              data: { showcaseId: null },
            });
          } else {
            throw new Error('Invalid item type');
          }
        }
      });

      const updatedShowcase = await prisma.showcase.findUnique({
        where: { id: parseInt(id, 10) },
        include: { items: true },
      });

      res.json(updatedShowcase);
    } catch (error) {
      console.error('Error removing items from showcase:', error);
      res.status(500).json({ error: 'Failed to remove items/collections from showcase' });
    }
  },

  // Get showcases by user UID
  getShowcasesByUserUid: async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const showcases = await prisma.showcase.findMany({
        where: { userId: user.id },
        include: { items: true },
      });

      res.json(showcases);
    } catch (error) {
      console.error('Error fetching showcases by user UID:', error);
      res.status(500).json({ error: 'Failed to fetch showcases' });
    }
  },
};

module.exports = showcaseController;
