const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const { isLoggedin } = require("../middleware.js")
const { isOwner } = require("../middleware");
const { validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route('/')
    //index route
    .get(wrapAsync(listingController.index))
    //create
    .post(
        isLoggedin,
        upload.single('listing[image]'),
        validatelisting,
        wrapAsync(listingController.createListing)
    );

//new route
router.get("/new", isLoggedin, listingController.renderNewForm);

router.route("/:id")
    //show route
    .get(wrapAsync(listingController.showListings))
    //update
    .put(
        isLoggedin,
        isOwner,
        upload.single('listing[image]'),
        validatelisting,
        wrapAsync(listingController.updateListing))
        //delete route
    .delete(isLoggedin, isOwner, wrapAsync(listingController.destroy));

//edit route
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));




module.exports = router;