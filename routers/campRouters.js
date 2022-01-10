const express = require("express");
const router = express.Router();
const campController = require("../controllers/campController");
const catchAsync = require("../err/catchAsync");
const multer  = require('multer');
const {storage} = require('../cloudinary_storage')
const upload = multer({ storage });

//? Middleware
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middlewares/middlewares");

//- Campgrounds
router.get("/", catchAsync(campController.index));

//- Add
router.get("/new", isLoggedIn, campController.newCampForm);
router.post(
  "/",
  isLoggedIn,
  upload.array('image'),
  validateCampground,
  catchAsync(campController.createNewCamp)
);

//- Search query
router.post("/campground")

//- Detail
router.get("/:id", catchAsync(campController.campDetail));

//- Edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campController.editCampForm)
);
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array('image'),
  validateCampground,
  catchAsync(campController.editedCamp)
);

//- Delete
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campController.campDelete)
);

module.exports = router;
