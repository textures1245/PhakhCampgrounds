const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../err/catchAsync");
const reviewController = require("../controllers/reviewController");

const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middlewares/middlewares");

//? Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewController.createReview)
);

//? Delete
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewController.reviewDelete)
);

module.exports = router;
