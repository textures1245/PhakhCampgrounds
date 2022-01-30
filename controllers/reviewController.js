const Camp = require('../models/camps');
const review = require('../models/review');
const Review = require('../models/review')

module.exports.createReview = async (req,res) => {
    const camp = await Camp.findById(req.params.id);
    const reviews = new Review(req.body.review);
    if(!reviews.rating) {
        req.flash('warning', 'You must rating before post a review!')
        return res.redirect(`/campgrounds/${camp._id}`)
    }
    reviews.author = req.user._id;
    camp.reviews.push(reviews);
    await reviews.save();
    await camp.save();
    req.flash('successReview', ('Review had been Created!'))
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.reviewDelete = async (req,res) => {
    const {id, reviewId} = req.params;
    await Camp.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) //* pull/delete camp's review id
    await Review.findByIdAndDelete(reviewId, {}) //* delete specific review id
    req.flash('successReview', ('Review had been deleted!'))
    res.redirect(`/campgrounds/${id}`)
}