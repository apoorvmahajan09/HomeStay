const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js").default;
const { isLoggedIn, isOwner, validateListing, test } = require("../middleware.js");
const {
    index,
    newListing,
    showListing,
    createListing,
    editListing,
    updateListing,
    deleteListing
} = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index + Create
router.route("/")
    .get(wrapAsync(index))   // index route
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(createListing)); // create route

// New (separate since it must come before :id)
router.get("/new", isLoggedIn, newListing);

// Show + Update + Delete
router.route("/:id")
    .get(wrapAsync(showListing))  // show route
    .put(isLoggedIn, isOwner, validateListing, upload.single("listing[image]"), wrapAsync(updateListing)) // update route
    .delete(isLoggedIn, wrapAsync(deleteListing)); // delete route

// Edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

module.exports = router;