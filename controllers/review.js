const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    review.author = res.locals.currentUser._id;
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    req.flash("success", "Created new review!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/listings/${id}`);
}