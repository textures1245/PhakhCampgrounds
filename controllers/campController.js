const Camp = require("../models/camps");
const ErrorStatus = require("../err/ErrHandler");
const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary_storage");

module.exports.index = async (req, response) => {
  //* query search
  if (typeof req.query.title !== "undefined") {
    const campgrounds = await Camp.find({
      $text: { $search: req.query.title },
    }).populate(["author", "reviews"]);
    return response.render("campgrounds/index", {
      title: "Phakh Campers",
      campgrounds,
      q: true,
    });
  }
  //* query categories
  if (typeof req.query.category !== "undefined") {
    const campgrounds = await Camp.find({category: {$in: req.query.category}}).populate(["author", "reviews"]);
    return response.render("campgrounds/index", {
      title: "Phakh Campers",
      campgrounds,
      q: true,
    });
  }

  const options = {
    page: req.query.page || 1,
    limit: 10,
    populate: ["reviews","author"],
  };
  
  Camp.paginate({}, options, (err, res) => {
    let links = [];
    let prevPage = "";
    let nextPage = "";
    for (let i = 1; i <= res.totalPages; i++) {
      if (i == res.page) {
        links.push(i); //- don't create current link page
      } else {
        links.push(`campgrounds?page=${i}`);
      }

      if (res.hasPrevPage) {
        //* if can move to previous page
        prevPage = `/campgrounds?page=${res.prevPage}`;
      }

      if (res.hasNextPage) {
        //* if can move to next page
        nextPage = `/campgrounds?page=${res.nextPage}`;
      }
    }
    let pageLink = links;

    response.render("campgrounds/index", {
      title: "Phakh Campers",
      campgrounds: res.docs,
      page: res.page,
      pageLink: pageLink,
      prevPage,
      nextPage,
      q: false,
    });
  });
};

module.exports.newCampForm = (req, res) => {
  res.render("campgrounds/new", { title: "New Campground" });
};

module.exports.createNewCamp = async (req, res, next) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Camp(req.body.campground);
  console.log(campground.category);
  if (campground.category === [""]) {
    req.flash("warning", "Category form need to be selected!");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  campground.geometry = geoData.body.features[0].geometry;
  campground.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "New Campground had been created!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.campDetail = async (req, res) => {
  let id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorStatus(404, "Page Not Found!");
  const camp = await Camp.findById(id, {})
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
    // console.log(camp);
  if (!camp) {
    req.flash("error", "The page you are looking for cannot be found :( ");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { title: `${camp.title}`, camp });
};

module.exports.editCampForm = async (req, res) => {
  let id = req.params.id;
  const camp = await Camp.findById(id, {});
  if (!camp) {
    req.flash("error", "The page you are looking for cannot be found :( ");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { title: "Edit", camp });
};

module.exports.editedCamp = async (req, res) => {
  let id = req.params.id;
  const camp = await Camp.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  if (req.body.campground.location) {
    const geoData = await geoCoder
      .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
      })
      .send();
    camp.geometry = geoData.body.features[0].geometry;
  }
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.image.push(...imgs);
  await camp.save();
  //* for deleting images
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Campground had been Edited!");
  if (!camp) {
    req.flash("warning", validateCampground);
    return res.redirect(`/campgrounds/${camp._id}/edit`);
  }
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.campDelete = async (req, res) => {
  let id = req.params.id;
  await Camp.findByIdAndDelete(id, {});
  req.flash("success", "Campground had been deleted!");
  res.redirect("/campgrounds");
};
