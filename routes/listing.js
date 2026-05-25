const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');

const listingsController = require('../controllers/listings');
const multer  = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

//Index Route - Show all listings
//Create Route - Create a new listing in the database
router
    .route('/')
    .get(wrapAsync(listingsController.index))
    .post(isLoggedIn,upload.single('image'),validateListing, wrapAsync(listingsController.createListing)
);

//New Route - Form to create new listing
router.get('/new', isLoggedIn, listingsController.renderNewForm);

//Show Route - Show details of one listing
//Update Route - Update an existing listing in the database
//Delete Route - Delete a listing from the database
router
    .route('/:id')
    .get(wrapAsync(listingsController.showListing))
    .put(isLoggedIn,isOwner,upload.single('image'),validateListing, wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingsController.destroyListing));


//Edit Route - Form to edit an existing listing
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingsController.renderEditForm));

module.exports = router;