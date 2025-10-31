const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js").default;
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { postReview, deleteReview } = require('../controllers/review.js');

router.post("/", validateReview, isLoggedIn, wrapAsync(postReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;