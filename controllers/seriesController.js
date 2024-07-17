const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seriesController = {
  // Get all series
  index: async (req, res) => {
    try {
      const series = await prisma.series.findMany();
      res.json(series);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch series' });
    }
  },

  // Create a new series
  create: async (req, res) => {
    try {
      const { name } = req.body;
      const newSeries = await prisma.series.create({
        data: { name },
      });
      res.status(201).json(newSeries);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create series' });
    }
  },

  // Get a specific series by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const series = await prisma.series.findUnique({
        where: { id: parseInt(id) },
      });
      if (series) {
        res.json(series);
      } else {
        res.status(404).json({ error: 'Series not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch series' });
    }
  },

  // Update a series by ID
  updateById: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedSeries = await prisma.series.update({
        where: { id: parseInt(id) },
        data: { name },
      });
      res.json(updatedSeries);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update series' });
    }
  },

  // Delete a series by ID
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.series.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: 'Series deleted!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete series' });
    }
  },
};

module.exports = seriesController;
