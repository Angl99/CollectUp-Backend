const express = require('express');
const itemRouter = express.Router();
const itemController = require('../controllers/itemController');

// Get all items
itemRouter.get('/', itemController.getAllItems);

// Search items
itemRouter.get('/search', itemController.searchItems);

itemRouter.get('/search-external-api', itemController.searchExternalApi);

// Search external products by keyword
itemRouter.post('/search-external-keyword', itemController.searchExternalKeyword);

// Get an item by ID
itemRouter.get('/:id', itemController.getItemById);

// Create a new item
itemRouter.post('/', itemController.createItem);

// Update an item by ID
itemRouter.put('/:id', itemController.updateItemById);

// Delete an item by ID
itemRouter.delete('/:id', itemController.deleteItemById);

module.exports = itemRouter;
