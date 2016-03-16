var request = require('request');

var apiOptions = {server: 'http://localhost:3000'}

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://wifiplz.herokuapp.com';
}

var showError = function(req, res, status) {
  var title, content;

  if (status === 404) {
    title = '404, page not found';
    content = 'Oh noz, can\'t find the page you are looking for. Sorriez :(';
  }
  else {
    title = status + ', something went wrong';
    content = 'hmm... somethings not right';
  }

  res.status(status);
  res.render('generic-text', {
    title: title,
    content: content
  });
}

var renderHomePage = function(req, res, resBody) {
  var message;

  if (!(resBody instanceof Array)) {
    message = 'API lookup error';
    resBody = [];
  }
  else {
    if (!resBody.length) {
      message = 'No places found nearby';
    }
  }
  res.render('locations-list', {
    title: 'wifiPlz - find a place to work with wifi',
    pageHeader: {
      title: 'wifiPlz',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? wifiPlz helps you find places to ' +
      'work when out and about. Perhaps with coffee, cake or a pint? ' +
      'Let wifiPlz help you find the place you\'re looking for.',
    locations: resBody,
    message: message
  });
}

var renderDetailPage = function(req, res, location) {
  res.render('location-info', {
    title: location.name,
    pageHeader: {title: location.name},
    sidebar: {
      context: 'is on wifiPlz because it has accessible wifi and space to sit ' +
        'down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - ' +
        'please leave a review to help other people just like you.'
    },
    location: location
  });
}

var renderReviewForm = function(req, res, location) {
  res.render('location-review-form', {
    title: 'Review ' + location.name + ' on wifiPlz',
    pageHeader: {title: 'Review ' + location.name},
    error: req.query.err
  });
}

var getLocationInfo = function(req, res, callback) {
  var path = '/api/locations/' + req.params.locationId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  }

  request(requestOptions, function(err, response, body) {
    var data = body;

    if (response.statusCode === 200) {
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      }

      callback(req, res, data);
    }
    else {
      showError(req, res, response.statusCode);
    }
  });
}

/* GET 'home' page */
module.exports.homeList = function(req, res) {
  var path = '/api/locations';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.7992599,
      lat: 51.378091,
      maxDistance: 25 * 1000
    }
  }

  // FIXME distances are wrong
  request(requestOptions, function(err, response, body) {
    var data = body;
    var formatDistance = function(dist) {
      var numDist, unit;

      if (dist > 1) {
        numDist = parseFloat(dist).toFixed(1);
        unit = 'km';
      }
      else {
        numDist = parseInt(dist * 1000, 10);
        unit = 'm';
      }

      return numDist + unit;
    }

    if (response.statusCode === 200 && data.length) {
      data.forEach(function(data) {
        data.distance = formatDistance(data.distance);
      });
    }
    renderHomePage(req, res, data);
  });
}

/* GET 'location info' page */
module.exports.locationInfo = function(req, res) {
  getLocationInfo(req, res, function(req, res, responseData) {
    renderDetailPage(req, res, responseData);
  });
}

/* GET 'add review' page */
module.exports.addReview = function(req, res) {
  getLocationInfo(req, res, renderReviewForm);
}
module.exports.doAddReview = function(req, res) {
  var locationId = req.params.locationId;
  var path = '/api/locations/' + locationId + '/reviews';
  var postData = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  }
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postData
  }

  if (!postData.author || !postData.rating || !postData.reviewText) {
    res.redirect('/location/' + locationId + '/review/new?err=val')
  }
  else {
    request(requestOptions, function(err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('/location/' + locationId);
      }
      else if (response.statusCode === 400 && body.name && body.name === 'ValidationError') {
        res.redirect('/location/' + locationId + '/review/new?err=val')
      }
      else {
        showError(req, res, response.statusCode);
      }
    });
  }
}
