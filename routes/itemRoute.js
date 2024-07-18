const express = require('express');
const itemRouter = express.Router();
const itemController = require('../controllers/itemController');

itemRouter.get('/', itemController.getAllItems);

itemRouter.post('/', itemController.createItem);

itemRouter.put('/:id', itemController.updateItemById);

itemRouter.delete('/:id', itemController.deleteItemById);

module.exports = itemRouter;
