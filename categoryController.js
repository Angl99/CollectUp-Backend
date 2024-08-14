const { prisma } = require('../helpers/prismaDbHelper');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await prisma.category.findMany();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },

  createCategory: async (req, res) => {
    const { name } = req.body;
    try {
      const newCategory = await prisma.category.create({
        data: { name },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  },

  // Add other CRUD operations as needed
};

module.exports = categoryController;
