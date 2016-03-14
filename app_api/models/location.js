var mongoose = require('mongoose');

var openingTimeSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean}
});

var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, min: 0, max: 5, required: true},
  createdOn: {type: Date, default: Date.now},
  reviewText: String
});

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String},
  rating: {type: Number, default: 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dsphere', required: true},
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);
