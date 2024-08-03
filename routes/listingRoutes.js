const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

// Create a new listing
router.post('/', listingController.createListing);

// Get all listings
router.get('/', listingController.getAllListings);

// Get a specific listing by ID
router.get('/:id', listingController.getListingById);

// Update a listing
router.put('/:id', listingController.updateListing);

// Delete a listing
router.delete('/:id', listingController.deleteListing);

module.exports = router;
