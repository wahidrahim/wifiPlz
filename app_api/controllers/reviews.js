var mongoose = require('mongoose');
var Location = mongoose.model('Location');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

var updateAverageRating = function(id) {
  Location
    .findById(id)
    .exec(function(err, location) {
      if (!err) {
        var reviews = location.reviews;
        var sum = 0;

        reviews.forEach(function(review) {
          sum += review.rating;
        });

        location.rating = parseInt(sum / reviews.length, 10);

        location.save(function(err, location) {
          if (err)
            console.log(err);
          else
            console.log("Average rating updated to:", location.rating);
        });
      }
    });
}

var addReview = function(res, status, location) {
  if (!location)
    sendJSONresponse(res, 404, {message: 'Location not found'});
  else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location) {
      if (err)
        sendJSONresponse(res, 400, err);
      else {
        var thisReview = location.reviews[location.reviews.length - 1];

        updateAverageRating(location._id);
        sendJSONresponse(res, 201, thisReview);
      }
    });
  }
}

module.exports.reviewCreate = function(req, res) {
  var locationId = req.params.locationId;

  if (locationId) {
    Location
      .findById(locationId)
      .select('reviews')
      .exec(function(err, location) {
        if (err) {
          sendJSONresponse(res, 400, err)
        }
        else {
          addReview(res, 201, location);
        }
      });
  }
  else {
    sendJSONresponse(res, 404, {message: 'Not found, locationId required'});
  }
}
module.exports.reviewRead = function(req, res) {
  if (req.params && req.params.locationId && req.params.reviewId) {
    Location
      .findById(req.params.locationId)
      .select('name reviews')
      .exec(function(err, location) {
        var response, review;

        if (!location) {
          sendJSONresponse(res, 404, {'message': 'location not found'});
          return;
        }
        else if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }

        if (location.reviews && location.reviews.length > 0) {
          // mongoose subdocument finding method
          review = location.reviews.id(req.params.reviewId);

          if (!review) {
            sendJSONresponse(res, 404, {'message': 'review not found'});
          }
          else {
            response = {
              location: {
                id: req.params.locationId,
                name: location.name
              },
              review: review
            };

            sendJSONresponse(res, 200, response);
          }
        }
        else {
          sendJSONresponse(res, 404, {'message': 'no reviews found'});
        }
      });
  }
  else {
    sendJSONresponse(res, 404, {'message': 'Not found, locationid and reviewid are both required'});
  }
}
module.exports.reviewUpdate = function(req, res) {
  if (!req.params.locationId || !rea.params.reviewId) {
    sendJSONresponse(res, 404, {'message': 'Not found, locationId and reviewId are both required'});
    return;
  }
  Location
    .findById(req.params.locationId)
    .select('reviews')
    .exec(function(err, location) {
      var review;

      if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      else if (!location) {
        sendJSONresponse(res, 404, {'messaage': 'locationId not found'});
        return;
      }

      if (location.reviews && location.reviews.length > 0) {
        review = location.reviews.id(req.params.reviewId);

        if (!review) {
          sendJSONresponse(res, 404, {'message': 'reviewId not found'});
          return;
        }
        else {
          review.author = req.body.author;
          review.rating = req.body.rating;
          review.reviewText = req.body.reviewText;

          location.save(function(err, location) {
            if (err) {
              sendJSONresponse(res, 404, err);
              return;
            }
            else {
              updateAverageRating(location._id);
              sendJSONresponse(res, 200, review);
            }
          });
        }
      }
      else {
        sendJSONresponse(res, 404, {'message': 'No review to update'});
      }
    });
}
module.exports.reviewDelete = function(req, res) {
  if (!req.params.locationId || !req.params.reviewId) {
    sendJSONresponse(res, 404, {'message': 'locaiodId and reviewId are both required'});
    return;
  }
  Location
    .findById(req.params.locationId)
    .select('reviews')
    .exec(function(err, location) {
      if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      else if (!location) {
        sendJSONresponse(res, 404, {'message': 'locationId not found'});
        return;
      }

      if (location.reviews && location.reviews.length > 0) {
        if (!location.reviews.id(req.params.reviewId)) {
          sendJSONresponse(res, 404, {'message': 'reviewId not found'});
          return;
        }
        location.reviews.id(req.params.reviewId).remove();
        location.save(function(err, location) {
          if (err) {
            sendJSONresponse(res, 404, err);
          }
          else {
            updateAverageRating(location._id);
            sendJSONresponse(res, 204, null);
          }
        });
      }
      else {
        sendJSONresponse(res, 404, {'message': 'No review to delete'});
      }
    });
}
