/* GET 'home' page */
module.exports.homeList = function(req, res) {
  res.render('locations-list',
      {
        title: 'wifiPlz - find a place to work with wifi',
        pageHeader: {
          title: 'wifiPlz',
          strapline: 'Find places to work with wifi near you!'
        },
        sidebar: 'Looking for wifi and a seat? wifiPlz helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let wifiPlz help you find the place you\'re looking for.',
        locations: [{
          name: 'MarkDonalds',
          address: '123 Fake Street, Kitchener, ON, N2PM96',
          rating: 3,
          facilities: ['Fast food', 'Coffee', 'Premium wifi'],
          distance: '150m'
        },
        {
          name: 'StarCups',
          address: '420 High Street, Waterloo, ON M4G1P9',
          rating: 4,
          facilities: ['Hot drinks', 'Food', 'Premium wifi'],
          distance: '100m'
        },
        {
          name: 'HotDogKing',
          address: '321 University Blvd, Waterloo, ON, X2ZP9T',
          rating: 2,
          facilities: ['Fast food', 'Wifi'],
          distance: '50m'
        }]
      });
}

/* GET 'location info' page */
module.exports.locationInfo = function(req, res) {
  res.render('location-info',
      {
        title: 'StarCups',
        pageHeader: {title: 'StarCups'},
        sidebar: {
          context: 'is on wifiPlz because it has accessible wifi and space to sit down with your laptop and get some work done.',
          callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: {
          name: 'StarCups',
          address: '420 High Street, Loo, ON, shiet',
          rating: 4,
          facilities: ['Hot drinks', 'Food', 'Premium wifi'],
          coords: {lat: 43.462797, lng: -80.521865},
          openingTimes: [{
            days: 'Monday - Friday',
            opening: '7:00am',
            closing: '11:00pm',
            closed: false
          },
          {
            days: 'Saturday',
            opening: '8:00am',
            closing: '10:00pm',
            closed: false
          },
          {
            days: 'Sunday',
            opening: '9:00am',
            closing: '9:00pm',
            closed: false
          }],
          reviews: [{
            author: 'Simon Bolms',
            rating: 4,
            timestamp: '16 July 2013',
            reviewText: 'OOooi so goot. I like this place.'
          },
          {
            author: 'Cholo Joplin',
            rating: 3,
            timestamp: '29 June 2014',
            reviewText: 'iz iight.'
          }]
        }
      });
}

/* GET 'add review' page */
module.exports.addReview = function(req, res) {
  res.render('location-review-form',
      {
        title: 'Review StarCups on wifiPlz',
        pageHeader: {title: 'Review StarCups'}
      });
}
