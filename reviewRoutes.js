const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../controllers/reviewController');

reviewRouter.get('/', reviewController.getAllReviews);
reviewRouter.post('/', reviewController.createReview);
reviewRouter.get('/:id', reviewController.getReviewById);
reviewRouter.put('/:id', reviewController.updateReview);
reviewRouter.delete('/:id', reviewController.deleteReview);

module.exports = reviewRouter;
