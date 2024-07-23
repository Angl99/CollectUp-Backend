const { prisma } = require('../helpers/prismaDbHelper')
const { getUserByUid } = require('../helpers/userHelper');


const getAllItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
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
};

const createItem = async (req, res) => {
  const { uid, productEan } = req.body;

  if (!uid || !productEan) {
    return res.status(400).json({ error: 'Firebase UID and productEan are required' });
  }

  try {
    const user = await getUserByUid(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newItem = await prisma.item.create({
      data: {
        userId: user.id,
        productEan: productEan.ean,
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
  getItemById,
  createItem,
  updateItemById,
  deleteItemById,
};
