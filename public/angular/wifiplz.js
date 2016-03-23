(function() {
  angular.module('wifiplz', []);

  var wifiplzData = function($http) {
    var locationByCoords = function(lat, lng) {
      return $http.get('/api/locations?lat='+ lat +'&lng='+ lng);
    }
    
    var locationById = function(id) {
      return $http.get('/api/locations/' + id)
    }

    return {
      locationByCoords: locationByCoords,
      locationById: locationById
    }
  }

  var locationListCtrl = function ($scope, wifiplzData, geolocation) {
    $scope.message = 'Checking your location';

    $scope.getData = function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      $scope.message = 'Searching for nearby places...';

      wifiplzData.locationByCoords(lat, lng)
        .success(function(data) {
          $scope.message = data.length > 0 ? '' : 'No locations found'
            $scope.data = { locations: data };
        })
        .error(function(e) {
          $scope.message = 'Sorry! Something went wrong here'
            console.log(e);
        });
    }

    $scope.showError = function(error) {
      $scope.$apply(function() {
        $scope.message = error.message;
      });
    }

    $scope.noGeo = function() {
      $scope.$apply(function() {
        $scope.message = 'Geolocation is not supported by this browser'
      });
    }

    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
  };
  
  var locationInfoCtrl = function($scope, wifiplzData) {
    wifiplzData.locationById()
  }

  var formatDistance = function() {
    return function(d) {
      if (d >= 1000) {
        return (parseFloat(d / 1000).toFixed(1) + ' km').replace('.0', '');
      }
      else {
        return parseFloat(d).toFixed(0) + ' m';
      }
    }
  }

  var ratingStars = function() {
    return {
      scope: {
        thisRating: '=rating'
      },
      templateUrl: '/angular/rating-stars.html'
    }
  }

  var geolocation = function() {
    var getPosition = function(cbSuccess, cbError, cbNoGeo) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
      }
      else {
        cbNoGeo();
      }
    }

    return {
      getPosition: getPosition
    }
  }

  angular.module('wifiplz')
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('wifiplzData', wifiplzData)
    .service('geolocation', geolocation)
})();
