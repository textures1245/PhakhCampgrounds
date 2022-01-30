const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const paginate = require('mongoose-paginate-v2');
const { ref } = require("joi");

//- Automatically responded scale images (w=300)
const ImageSchema = new Schema({
    url: String,
    filename: String,
})
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_300')
})

const opts = { toJSON: { virtuals: true } };

const CampSchema = new Schema({
  title: {
    type: String,
  },
  image: [ImageSchema],
  geometry: {
    type: {
      type: String, 
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  category: {
    type: [String],
    default: ["Campground"]
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, opts);


CampSchema.virtual('properties.popUpMarkUp').get(function() {
  return `
  <div class="text-center">
  <h6><a href="/campgrounds/${this._id}">${this.title}</a></h6>
  <p>${this.description.substring(0,25)}...</p>
  <label class="text-muted">${this.location}</label>
  </div>
  `
})

//- Middleware camp's reviews deleted (findByIdAndDelete)
CampSchema.post("findOneAndDelete", async function (camp) {
  if (camp.reviews.length) {
    const res = await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});
CampSchema.plugin(paginate);

module.exports = mongoose.model("Camp", CampSchema);
