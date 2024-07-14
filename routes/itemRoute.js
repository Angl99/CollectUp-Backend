const express = require('express');
const itemRouter = express.Router();
const itemController = require('../controllers/itemController');

itemRouter.get('/', itemController.getAllItems);
// itemRouter.get('/:id', itemController.getItemById);
itemRouter.get('/search', itemController.searchItem);
itemRouter.post('/', itemController.createItem);
itemRouter.put('/:id', itemController.updateItemById);
itemRouter.delete('/:id', itemController.deleteItemById);


module.exports = itemRouter;