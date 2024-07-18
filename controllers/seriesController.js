const { prisma } = require('../helpers/prismaDbHelper')


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
      console.log(error);
      res.status(500).json({ error: 'Failed to delete series' });
    }
  },

  // Get all products for a specific series
  getSeriesProducts: async (req, res) => {
    try {
      const { id } = req.params;
      const seriesWithProducts = await prisma.series.findUnique({
        where: { id: parseInt(id) },
        include: {
          products: {
            include: {
              product: true
            }
          }
        }
      });
      if (seriesWithProducts) {
        res.json(seriesWithProducts.products.map(p => p.product));
      } else {
        res.status(404).json({ error: 'Series not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch series products' });
    }
  },

  // Add a product to a series
  addProductToSeries: async (req, res) => {
    try {
      const { id } = req.params;
      const { productEan } = req.body;
      const updatedSeries = await prisma.series.update({
        where: { id: parseInt(id) },
        data: {
          products: {
            create: {
              product: {
                connect: { ean: productEan }
              }
            }
          }
        },
        include: {
          products: {
            include: {
              product: true
            }
          }
        }
      });
      res.json(updatedSeries);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add product to series' });
    }
  },

  // Remove a product from a series
  removeProductFromSeries: async (req, res) => {
    try {
      const { id, productEan } = req.params;
      await prisma.productSeries.delete({
        where: {
          productEan_seriesId: {
            productEan: productEan,
            seriesId: parseInt(id)
          }
        }
      });
      res.status(200).json({ message: 'Product removed from series' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to remove product from series' });
    }
  },
};

module.exports = seriesController;
