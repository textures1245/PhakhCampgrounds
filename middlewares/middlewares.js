const Camp = require('../models/camps');
const campgroundSchema = require('../err/errCampSchema.js')
const reviewSchema = require('../err/errReviewSchema.js')
const ErrorStatus = require('../err/ErrHandler')
const Review = require('../models/review')

const isLoggedIn = (req,res,next) => {
    // console.log('User:' + req.user)
    //* Check if user have logged in yet before do some feature
    if(!req.isAuthenticated()) {
        //* store previous path url 
        //* (when logged in it will return to last previous url that user been visited to)
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'You must be login first, before try this feature.')
        return res.redirect('/login')
    } else {
        next();
    }
}

//- Middleware validation
const validateCampground = (req,res,next) => {
    //* Joi module can easily handler err JS
    const {error} = campgroundSchema.validate(req.body) //*checked any errors that had occurring
    if (error) {
        const msg = error.details.map(elems => elems.message).join(',')
        throw new ErrorStatus(400, msg)
    } else {
        next()
    }
}

//- Middleware Review Error Handler (Joi module)
const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(elems => elems.message).join(',')
        throw new ErrorStatus(400, msg)
    } else {
        next()
    }
}

//- User Permission
const isAuthor = async(req,res,next) => {
    const id = req.params.id
    const campCheck = await Camp.findById(id);
    if (!campCheck.author.equals(req.user._id)) {
        req.flash('warning', 'You do not have a permission!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
const isReviewAuthor = async(req,res,next) => {
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('warning', 'You do not have a permission!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


module.exports = {isLoggedIn, validateCampground, isAuthor, validateReview, isReviewAuthor}