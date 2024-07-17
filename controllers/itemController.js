const { PrismaClient } = require('@prisma/client');
const { getUserByUid } = require('../helpers/userHelper');
const prisma = new PrismaClient();

const getAllItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

const searchItem = async (req, res) => {
  const { code, type } = req.query;
  try {
    const item = await prisma.item.findFirst({
      where: {
        data: {
          path: ['code'],
          equals: code,
        },
      },
    });
    if (!item) {
      return res.status(404).json(null);
    }
    res.json(item);
  } catch (error) {
    console.error('Error searching item:', error);
    res.status(500).json({ error: 'Failed to search item' });
  }
};

const createItem = async (req, res) => {
  const { userId, productEan } = req.body;

  if (!userId || !productEan) {
    return res.status(400).json({ error: 'UserId and productEan are required' });
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        userId: parseInt(userId),
        productEan: productEan,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};


const updateItemById = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        items: data,
      },
    });
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

const deleteItemById = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.item.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

module.exports = {
  getAllItems,
  searchItem,
  createItem,
  updateItemById,
  deleteItemById,
};
