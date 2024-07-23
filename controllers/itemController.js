const { prisma } = require('../helpers/prismaDbHelper');
const { getUserByUid } = require('../helpers/userHelper');

const itemController = {
  // Get all items
  getAllItems: async (req, res) => {
    try {
      // Fetch all items from the database
      const items = await prisma.item.findMany();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  },

  // Get a specific item by ID
  getItemById: async (req, res) => {
    const { id } = req.params;
    try {
      // Find the item by its ID
      const item = await prisma.item.findUnique({
        where: { id: parseInt(id) },
      });
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  },

  // Create a new item
  createItem: async (req, res) => {
    const { uid, productEan, imageUrl, condition, userDescription } = req.body;

    if (!uid || !productEan) {
      return res.status(400).json({ error: 'Firebase UID and productEan are required' });
    }

    try {
      // Get the user by their Firebase UID
      const user = await getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create a new item in the database
      const newItem = await prisma.item.create({
        data: {
          user: { connect: { id: user.id } },
          product: { connect: {ean: productEan} },
          imageUrl: imageUrl || "",
          condition: condition || "",
          userDescription,
        },
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Failed to create item' });
    }
  },

  // Update an item by ID
  updateItemById: async (req, res) => {
    const { id } = req.params;
    const { imageUrl, condition, userDescription } = req.body;
    try {
      // Update the item in the database
      const updatedItem = await prisma.item.update({
        where: { id: parseInt(id) },
        data: {
          imageUrl,
          condition,
          userDescription,
        },
      });
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  },

  // Delete an item by ID
  deleteItemById: async (req, res) => {
    const { id } = req.params;
    try {
      // Delete the item from the database
      await prisma.item.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  },
};

module.exports = itemController;
