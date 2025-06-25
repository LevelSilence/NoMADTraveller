const Listing = require('../models/listing');
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added successfully!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted successfully!");
    res.redirect(`/listings/${id}`);
}