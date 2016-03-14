var mongoose = require('mongoose');
var Location = mongoose.model('Location');

// reusable functions for making distance calculations
//var theEarth = (function() {
//  var radius = 6371; // km

//  var fromRads = function(rads) {
//    return parseFloat(rads * radius);
//  }

//  var fromDist = function(dist) {
//    return parseFloat(dist / radius);
//  }

//  return {
//    getDistFromRads: fromRads,
//    getRadsFromDist: fromDist
//  }
//})();

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.locationsListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  if (!lng || !lat) {
    sendJSONresponse(res, 404, {message: 'lng and lat query parameters are required'});
    return;
  }

  var point = {
    type: 'Point',
    coordinates: [lng, lat]
  }

  var geoOptions = {
    spherical: true,
    num: 10,
    maxDistance: 25000 // meters
      //maxDistance: theEarth.getRadsFromDist(25) // TODO get maxdistance from query string later
  }

  Location.geoNear(point, geoOptions, function(err, docs) {
    if (err) {
      sendJSONresponse(res, 404, err)
    }
    else {
      var locations = [];

      docs.forEach(function(doc) {
        locations.push({
          //distance: theEarth.getDistFromRads(doc.dis),
          distance: doc.dis,
          name: doc.obj.name,
          address: doc.obj.address,
          rating: doc.obj.rating,
          facilities: doc.obj.facilities,
          _id: doc.obj._id
        });
      });

      sendJSONresponse(res, 200, locations);
    }
  });
}
module.exports.locationsCreate = function(req, res) {
  var newLoc = {
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(','),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1
    },{
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2
    }],
  }

  Location.create(newLoc, function(err, location) {
    if (err)
      sendJSONresponse(res, 400, err);
    else
      sendJSONresponse(res, 201, location);
  });
}
module.exports.locationRead = function(req, res) {
  if (req.params && req.params.locationId) {
    Location
      .findById(req.params.locationId)
      .exec(function(err, location) {
        if (!location) {
          sendJSONresponse(res, 404, {'message': 'location not found'});
          return;
        }
        else if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }
        sendJSONresponse(res, 200, location);
      });
  }
  else {
    sendJSONresponse(res, 404, {'message': 'no locationId in request'});
  }
}
module.exports.locationUpdate = function(req, res) {
  if (!req.params.locationId) {
    sendJSONresponse(res, 404, {'message': 'Not found, locationId is required'});
    return;
  }
  Location
    .findById(req.params.locationId)
    .select('-reviews -rating')
    .exec(function(err, location) {
      if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      else if (!location) {
        sendJSONresponse(res, 404, {'message': 'locationId not found'});
        return;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(',');
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1
      },{
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }];
      location.save(function(err, location) {
        if (err) {
          sendJSONresponse(res, 404, err);
        }
        else {
          sendJSONresponse(res, 200, location);
        }
      });
    });
}
module.exports.locationDelete = function(req, res) {
  if (req.params.locationId) {
    Location
      .findByIdAndRemove(req.params.locationId)
      .exec(function(err, location) {
        if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }
        sendJSONresponse(res, 204, null);
      });
  }
  else {
    sendJSONresponse(res, 404, {'message': 'locationId is required'});
  }
}
